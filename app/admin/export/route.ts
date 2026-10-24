import { isAdmin } from "@/lib/auth";
import { getSignups } from "@/lib/db";

export const dynamic = "force-dynamic";

// Prefix values a spreadsheet would treat as a formula.
function cell(v: string) {
  const safe = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const rows = await getSignups();
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
