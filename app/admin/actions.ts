"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, adminConfigured, checkCredentials, createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { checkLimit, clientIp, memoryLimit, rateLimit, requestHost, resetLimit, retryMessage } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export type LoginState = { error: string };

const MAX_FIELD_LENGTH = 512;
const FAILURE_WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES = 5;
// Cheap per-instance cap so one source can't make us call Cloudflare's verify endpoint in a tight loop.
const MAX_ATTEMPTS_PER_INSTANCE = { max: 30, windowSeconds: 15 * 60 };

const field = (form: FormData, name: string) => {
  const v = form.get(name);
  return typeof v === "string" ? v : "";
};

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Admin login isn’t configured. Set ADMIN_SECRET and ADMIN_PASSWORD." };

  const h = await headers();
  const ip = clientIp(h);
  const secret = field(form, "secret");
  const password = field(form, "password");
  const token = field(form, "cf-turnstile-response");
  if (!secret || !password || secret.length > MAX_FIELD_LENGTH || password.length > MAX_FIELD_LENGTH || token.length > 2048) {
    return { error: "Incorrect secret or password." };
  }

  const attempts = memoryLimit(`admin-login:${ip ?? "unknown"}`, MAX_ATTEMPTS_PER_INSTANCE.max, MAX_ATTEMPTS_PER_INSTANCE.windowSeconds);
  if (!attempts.ok) return { error: retryMessage(attempts.retryAfter) };

  // Verified before any database work or credential check.
  const human = await verifyTurnstile(token, { ip, action: "admin-login", hostname: requestHost(h) });
  if (human === "unavailable") return { error: "Verification is unavailable right now. Please try again in a moment." };
  if (human === "failed") return { error: "Verification failed. Please try again." };

  let valid: boolean;
  try {
    const failures = await checkLimit("admin-login-failed", ip, MAX_FAILURES);
    if (!failures.ok) return { error: retryMessage(failures.retryAfter) };

    valid = checkCredentials(secret, password);
    if (valid) await resetLimit("admin-login-failed", ip);
    else await rateLimit("admin-login-failed", ip, MAX_FAILURES, FAILURE_WINDOW_SECONDS);
  } catch (e) {
    console.error("admin login rate limit failed", e);
    return { error: "Login is unavailable right now because the database can’t be reached." };
  }

  if (!valid) {
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Incorrect secret or password." };
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: sessionCookieOptions.path });
  redirect("/admin");
}
