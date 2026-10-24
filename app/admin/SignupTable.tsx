"use client";

import { useEffect, useMemo, useState } from "react";
import type { Signup } from "@/lib/db";

const utc = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

export default function SignupTable({ rows }: { rows: Signup[] }) {
  const [query, setQuery] = useState("");
  // Server renders UTC; switch to the viewer's local time after hydration.
  const [fmt, setFmt] = useState(() => utc);
  useEffect(() => setFmt(new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" })), []);

  const numbered = useMemo(() => rows.map((r, i) => ({ ...r, n: rows.length - i })), [rows]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? numbered.filter((r) => r.email.includes(q)) : numbered;
  }, [numbered, query]);

  return (
    <section className="card table-card">
      <div className="table-head">
        <h2>Waitlist</h2>
        <div className="table-tools">
          <input type="search" placeholder="Search emails" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search emails" />
          <a className="btn ghost-dark" href="/admin/export">Export CSV</a>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="empty">No signups yet.</p>
      ) : (
        <div className="scroll">
          <table>
            <thead>
              <tr><th>#</th><th>Email</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td className="num">{r.n}</td>
                  <td>{r.email}</td>
                  <td><time dateTime={r.created_at}>{fmt.format(new Date(r.created_at))}{fmt === utc ? " UTC" : ""}</time></td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={3} className="empty">No emails match “{query}”.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
