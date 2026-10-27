import { cookies } from "next/headers";
import { getViewers, incrementViewers } from "@/lib/db";
import { clientIp, memoryLimit, sameOrigin } from "@/lib/rate-limit";

const COOKIE = "wrenyn_viewer";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|curl|wget|python|httpclient|go-http/i;

// Per server instance. Generous enough for a whole college behind one NAT IP; floods beyond it are served
// the cached total without being counted, so they can't inflate the number or drive database writes.
const NEW_VIEWERS_PER_IP = { max: 300, windowSeconds: 60 * 60 };
const NEW_VIEWERS_PER_INSTANCE = { max: 30, windowSeconds: 1 };
const CACHE_MS = 15_000;

const cache = globalThis as unknown as { viewers?: { value: number; at: number }; viewersLoad?: Promise<number> };

/** The total, read from the DB at most once per CACHE_MS per instance however many requests arrive. */
async function cachedViewers(): Promise<number> {
  const c = cache.viewers;
  if (c && Date.now() - c.at < CACHE_MS) return c.value;
  cache.viewersLoad ??= getViewers()
    .then((value) => {
      cache.viewers = { value, at: Date.now() };
      return value;
    })
    .finally(() => {
      cache.viewersLoad = undefined;
    });
  return cache.viewersLoad;
}

// Counts each browser once: the first visit increments the total and sets a year-long cookie.
export async function POST(req: Request) {
  if (!sameOrigin(req) || Number(req.headers.get("content-length") ?? "0") > 0) {
    return Response.json({ viewers: null }, { status: 400 });
  }

  const store = await cookies();
  try {
    const seen = store.has(COOKIE) || BOT.test(req.headers.get("user-agent") ?? "");
    const allowed =
      !seen &&
      memoryLimit(`views:${clientIp(req.headers) ?? "unknown"}`, NEW_VIEWERS_PER_IP.max, NEW_VIEWERS_PER_IP.windowSeconds).ok &&
      memoryLimit("views:instance", NEW_VIEWERS_PER_INSTANCE.max, NEW_VIEWERS_PER_INSTANCE.windowSeconds).ok;
    if (!allowed) return Response.json({ viewers: await cachedViewers() });

    const viewers = await incrementViewers();
    cache.viewers = { value: viewers, at: Date.now() };
    store.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return Response.json({ viewers });
  } catch (e) {
    console.error("viewer count failed", e);
    return Response.json({ viewers: null }, { status: 503 });
  }
}
