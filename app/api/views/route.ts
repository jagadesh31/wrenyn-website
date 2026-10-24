import { cookies } from "next/headers";
import { getViewers, incrementViewers } from "@/lib/db";

const COOKIE = "wrenyn_viewer";
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

// Counts each browser once: the first visit increments the total and sets a year-long cookie.
export async function POST(req: Request) {
  const store = await cookies();
  try {
    const seen = store.has(COOKIE) || BOT.test(req.headers.get("user-agent") ?? "");
    if (seen) return Response.json({ viewers: await getViewers() });

    const viewers = await incrementViewers();
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
