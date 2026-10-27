import { addSignup } from "@/lib/db";
import { clientIp, readJson, requestHost, sameOrigin } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const GMAIL = /^[a-z0-9._%+-]+@gmail\.com$/;
const MAX_BODY_BYTES = 4096;
const MAX_TOKEN_LENGTH = 2048;

const fail = (error: string, status: number) => Response.json({ error }, { status });

// Everything before verifyTurnstile is cheap and touches no database, so bot floods never reach Postgres.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Forbidden.", 403);

  const body = await readJson(req, MAX_BODY_BYTES);
  if (!body) return fail("Invalid request.", 400);

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const token = typeof body.token === "string" ? body.token : "";
  if (email.length > 254 || !GMAIL.test(email)) {
    return fail("Enter a valid Gmail address, like name@gmail.com.", 400);
  }
  if (token.length > MAX_TOKEN_LENGTH) return fail("Invalid request.", 400);

  const human = await verifyTurnstile(token, {
    ip: clientIp(req.headers),
    action: "waitlist",
    hostname: requestHost(req.headers),
  });
  if (human === "failed") return fail("Verification failed. Please try again.", 403);
  if (human === "unavailable") return fail("Verification is unavailable right now. Please try again in a moment.", 503);

  try {
    await addSignup(email);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("waitlist insert failed", e);
    return fail("Couldn’t save right now. Please try again in a moment.", 503);
  }
}
