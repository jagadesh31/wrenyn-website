"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import BirdMark from "./BirdMark";
import { CONTACT_TOPICS } from "@/lib/contact";
import { mountTurnstile, type Challenge } from "./turnstile";

const ContactContext = createContext<() => void>(() => {});

export function ContactButton({ children = "Let’s talk", className = "btn" }: { children?: ReactNode; className?: string }) {
  const open = useContext(ContactContext);
  return <button type="button" className={className} onClick={open}>{children}</button>;
}

export function ContactForm({ onDone }: { onDone?: () => void }) {
  const id = useId();
  const captcha = useRef<HTMLDivElement>(null);
  const challenge = useRef<Challenge | null>(null);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (key && captcha.current) challenge.current = mountTurnstile(captcha.current, key, "contact");
    return () => { challenge.current?.remove(); challenge.current = null; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const token = challenge.current ? await challenge.current.token() : "";
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, token }), signal: AbortSignal.timeout(15000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send your message. Try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Try again.");
    } finally {
      challenge.current?.consume();
      pending.current = false;
      setBusy(false);
    }
  }

  if (sent) return <div className="contact-success" role="status"><span aria-hidden="true">✓</span><h3>Your message is with us.</h3><p>Thanks for sharing. We’ll use the email you provided to follow up on your request.</p>{onDone ? <button className="btn" onClick={onDone}>Done</button> : <Link href="/" className="btn">Back to Wrenyn</Link>}</div>;
  return <form className="contact-form" onSubmit={submit} aria-busy={busy}>
    <div className="contact-field-pair"><div><label htmlFor={`${id}-name`}>Name <span>(optional)</span></label><input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} placeholder="Your name" disabled={busy} /></div><div><label htmlFor={`${id}-email`}>Email</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" required disabled={busy} /></div></div>
    <label htmlFor={`${id}-topic`}>What’s on your mind?</label><select id={`${id}-topic`} name="topic" disabled={busy}>{CONTACT_TOPICS.map(topic => <option key={topic}>{topic}</option>)}</select>
    <label htmlFor={`${id}-message`}>Your message</label><textarea id={`${id}-message`} name="message" rows={4} minLength={10} maxLength={4000} placeholder="Tell us what you’re working on, or what keeps getting in the way." required disabled={busy} />
    <p className="contact-privacy">We’ll only use these details to respond to your request. <Link href="/privacy" onClick={onDone}>How we handle your information</Link></p>
    <div ref={captcha} />
    {error && <p className="contact-error" role="alert">{error}</p>}
    <button className="btn contact-submit" type="submit" disabled={busy}>{busy ? "Sending your message…" : "Send message"}<span aria-hidden="true">↗</span></button>
  </form>;
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => dialog.current?.close();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <ContactContext.Provider value={() => { setOpen(true); dialog.current?.showModal(); }}>
    {children}
    <dialog className="contact-dialog" ref={dialog} aria-labelledby="contact-title" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); } }}>
      <button className="close" type="button" onClick={close} aria-label="Close contact form">×</button>
      <div className="contact-heading"><BirdMark /><p className="co-kicker">TALK TO WRENYN</p><h2 id="contact-title">What should work better?</h2><p>A product question, a stubborn workflow, or an idea for something new. We’d like to hear it.</p></div>
      {open && <ContactForm onDone={close} />}
    </dialog>
  </ContactContext.Provider>;
}
