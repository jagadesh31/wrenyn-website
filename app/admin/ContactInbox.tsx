"use client";
import { useState } from "react";
import type { ContactRequest } from "@/lib/db";
export default function ContactInbox({ rows }: { rows: ContactRequest[] }) {
  const [query, setQuery] = useState("");
  const shown = rows.filter(row => [row.name, row.email, row.topic, row.message].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <section className="card contact-inbox"><div className="table-head"><h2>Contact inbox</h2><input type="search" aria-label="Search contact requests" placeholder="Search messages" value={query} onChange={event => setQuery(event.target.value)} /></div><p className="muted">Latest 500 requests. Reply opens your email app.</p>{shown.map(row => <article key={row.id}><div><strong>{row.name || row.email}</strong><span>{row.topic}</span></div><a href={"mailto:" + encodeURIComponent(row.email) + "?subject=" + encodeURIComponent("Re: " + row.topic + " — Wrenyn")}>{row.email} ↗</a><p>{row.message}</p><time dateTime={row.created_at}>{new Date(row.created_at).toISOString().slice(0, 16).replace("T", " ")} UTC</time></article>)}{!shown.length && <p className="empty">{rows.length ? "No matching messages." : "No contact requests yet."}</p>}</section>;
}

