import "server-only";
import { createHash } from "node:crypto";
import { clearRateLimit, hitRateLimit, peekRateLimit } from "./db";

export type Limit = { ok: boolean; retryAfter: number };

// Vercel overwrites x-real-ip / x-forwarded-for with the real client address, so these can't be spoofed there.
export function clientIp(headers: Headers): string | null {
  return headers.get("x-real-ip") || headers.get("x-forwarded-for")?.split(",")[0].trim() || null;
}

/** The host the visitor actually requested, without the port. */
export function requestHost(headers: Headers): string {
  return (headers.get("x-forwarded-host") || headers.get("host") || "").split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
}

/** Browsers always send Origin on fetch POSTs; rejecting cross-site or Origin-less requests drops naive scripted floods for free. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).hostname.toLowerCase() === requestHost(req.headers);
  } catch {
    return false;
  }
}

/** Reads a JSON body without ever buffering more than `maxBytes`. Returns null for anything malformed or oversized. */
export async function readJson(req: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return null;
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes || !req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

// In-memory fixed windows, per server instance. Costs no DB work, so it's safe to run on every request of a flood.
const MAX_TRACKED_KEYS = 50_000;
const windows = new Map<string, { hits: number; resetAt: number }>();

export function memoryLimit(key: string, max: number, windowSeconds: number): Limit {
  const now = Date.now();
  let w = windows.get(key);
  if (!w || w.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
      if (windows.size >= MAX_TRACKED_KEYS) windows.clear();
    }
    w = { hits: 0, resetAt: now + windowSeconds * 1000 };
    windows.set(key, w);
  }
  w.hits++;
  return { ok: w.hits <= max, retryAfter: Math.max(1, Math.ceil((w.resetAt - now) / 1000)) };
}

// DB-backed limits are shared across instances; only use them after cheap checks (like Turnstile) have passed.
function key(scope: string, ip: string | null) {
  const salt = process.env.ADMIN_SECRET ?? "wrenyn";
  return `${scope}:${createHash("sha256").update(`${salt}:${ip ?? "unknown"}`).digest("base64url")}`;
}

/** Counts this request and reports whether the IP is still within `max` per `windowSeconds`. Throws if the DB is down. */
export async function rateLimit(scope: string, ip: string | null, max: number, windowSeconds: number): Promise<Limit> {
  const { hits, resetIn } = await hitRateLimit(key(scope, ip), windowSeconds);
  return { ok: hits <= max, retryAfter: resetIn };
}

/** Checks the count without adding to it, for limits that only count some outcomes (like failed logins). */
export async function checkLimit(scope: string, ip: string | null, max: number): Promise<Limit> {
  const { hits, resetIn } = await peekRateLimit(key(scope, ip));
  return { ok: hits < max, retryAfter: resetIn };
}

export async function resetLimit(scope: string, ip: string | null) {
  await clearRateLimit(key(scope, ip));
}

export function retryMessage(seconds: number) {
  if (seconds < 60) return `Too many attempts. Try again in ${seconds} second${seconds === 1 ? "" : "s"}.`;
  const minutes = Math.ceil(seconds / 60);
  return `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

export function tooManyRequests(retryAfter: number, body: Record<string, unknown> = { error: retryMessage(retryAfter) }) {
  return Response.json(body, { status: 429, headers: { "Retry-After": String(retryAfter) } });
}
