import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Cloudflare's documented test secrets answer with a dummy hostname ("example.com"), so the hostname check can't apply to them.
const TEST_SECRET = /^[123]x0+AA$/;

export type TurnstileResult = "ok" | "failed" | "unavailable";

/**
 * Checks a Turnstile token with Cloudflare. Makes no database calls, so it's safe to run before anything else.
 * Tokens are single-use: Cloudflare rejects a token it has already verified.
 */
export async function verifyTurnstile(
  token: string,
  opts: { ip: string | null; action: string; hostname: string },
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Lets local dev work without keys; production must never accept unverified requests.
    if (process.env.NODE_ENV !== "production") return "ok";
    console.error("TURNSTILE_SECRET_KEY is not set; rejecting requests that need verification");
    return "unavailable";
  }
  if (!token || token.length > 2048) return "failed";

  const body = new URLSearchParams({ secret, response: token });
  if (opts.ip) body.set("remoteip", opts.ip);
  let data: { success?: boolean; action?: string; hostname?: string; "error-codes"?: string[] };
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(8000) });
    data = await res.json();
  } catch (e) {
    console.error("turnstile verify failed", e);
    return "unavailable";
  }

  if (!data.success) {
    console.warn("turnstile rejected", data["error-codes"]);
    return "failed";
  }
  // Stops a token solved on one form (e.g. the waitlist) from being replayed on another.
  if (data.action && data.action !== opts.action) {
    console.warn("turnstile action mismatch", data.action, "expected", opts.action);
    return "failed";
  }
  if (!TEST_SECRET.test(secret) && opts.hostname && data.hostname && data.hostname.toLowerCase() !== opts.hostname) {
    console.warn("turnstile hostname mismatch", data.hostname, "expected", opts.hostname);
    return "failed";
  }
  return "ok";
}
