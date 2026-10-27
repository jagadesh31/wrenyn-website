import { isAdmin } from "@/lib/auth";
import { getSignups, type Signup } from "@/lib/db";
import { clientIp, memoryLimit, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_EXPORTS = 10;
const WINDOW_SECONDS = 60;

// Prefix values a spreadsheet would treat as a formula.
function cell(v: string) {
  const safe = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  // The session check is a local HMAC comparison, so unauthenticated traffic never reaches the database.
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const limit = memoryLimit(`admin-export:${clientIp(req.headers) ?? "unknown"}`, MAX_EXPORTS, WINDOW_SECONDS);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let rows: Signup[];
  try {
    rows = await getSignups();
  } catch (e) {
    console.error("admin export failed", e);
    return new Response("Couldn’t load data from the database.", { status: 503 });
  }
  const csv = ["email,joined_at", ...rows.map((r) => `${cell(r.email)},${cell(r.created_at)}`)].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="wrenyn-waitlist-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
