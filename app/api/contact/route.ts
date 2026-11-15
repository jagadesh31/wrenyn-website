import { addContact } from "@/lib/db";
import { parseContact } from "@/lib/contact";
import { clientIp, memoryLimit, rateLimit, readJson, requestHost, sameOrigin, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(req: Request) {
  const fail = (error: string, status: number) => Response.json({ error }, { status });
  if (!sameOrigin(req)) return fail("Forbidden.", 403);
  const ip = clientIp(req.headers);
  const cheap = memoryLimit(`contact:${ip ?? "unknown"}`, 10, 600);
  if (!cheap.ok) return tooManyRequests(cheap.retryAfter);
  const body = await readJson(req, 24_000);
  if (!body) return fail("Invalid request.", 400);
  const parsed = parseContact(body);
  if (parsed.error) return fail(parsed.error, 400);
  const token = typeof body.token === "string" ? body.token : "";
  if (token.length > 2048) return fail("Invalid request.", 400);
  const human = await verifyTurnstile(token, { ip, action: "contact", hostname: requestHost(req.headers) });
  if (human === "failed") return fail("Verification failed. Please try again.", 403);
  if (human === "unavailable") return fail("Verification is unavailable. Please try again shortly.", 503);
  try {
    const limit = await rateLimit("contact", ip, 5, 3600);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);
    await addContact(parsed.value);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("contact save failed", error);
    return fail("Your message could not be saved. Please try again shortly.", 503);
  }
}
