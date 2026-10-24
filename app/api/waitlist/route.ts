import { addSignup } from "@/lib/db";

const GMAIL = /^[a-z0-9._%+-]+@gmail\.com$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {}

  if (email.length > 254 || !GMAIL.test(email)) {
    return Response.json({ error: "Enter a valid Gmail address, like name@gmail.com." }, { status: 400 });
  }

  try {
    await addSignup(email);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("waitlist insert failed", e);
    return Response.json({ error: "Couldn’t save right now. Please try again in a moment." }, { status: 500 });
  }
}
