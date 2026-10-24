"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import BirdMark from "./BirdMark";

const KEY = "wrenyn_waitlist";
const GMAIL = /^[a-z0-9._%+-]+@gmail\.com$/;
const BIRD_HTML = '<img class="wing" src="/wrenyn-wing.png" alt=""><img class="body" src="/wrenyn-body.png" alt="">';

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function spark(sky: HTMLElement, cx: number, cy: number, burst: boolean) {
  const d = document.createElement("i");
  d.className = "spark";
  sky.appendChild(d);
  const a = Math.random() * 6.283;
  const r = burst ? 36 + Math.random() * 70 : 8 + Math.random() * 26;
  const dx = burst ? Math.cos(a) * r : -r;
  const dy = burst ? Math.sin(a) * r : r * 0.7 + Math.random() * 16;
  const s = 0.5 + Math.random() * 0.9;
  d.animate(
    [
      { transform: `translate(${cx}px,${cy}px) scale(${s})`, opacity: 1 },
      { transform: `translate(${cx + dx}px,${cy + dy}px) scale(0)`, opacity: 0 },
    ],
    { duration: 650 + Math.random() * 550, easing: "cubic-bezier(.2,.7,.3,1)" },
  ).onfinish = () => d.remove();
}

export default function Waitlist() {
  const dlg = useRef<HTMLDialogElement>(null);
  const bird = useRef<HTMLSpanElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [joined, setJoined] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });

  useEffect(() => {
    try { setJoined(localStorage.getItem(KEY)); } catch {}
    return () => clearTimeout(toastTimer.current);
  }, []);

  function open() {
    if (joined) {
      showMessage(GMAIL.test(joined) ? `You’re already on the list as ${joined}.` : "You’re already on the list.");
      return;
    }
    const d = dlg.current!;
    busyRef.current = false;
    setBusy(false);
    setError("");
    input.current!.value = "";
    bird.current!.style.visibility = "";
    d.classList.remove("leaving");
    d.showModal();
    input.current!.focus();
  }

  function close() {
    const d = dlg.current!;
    if (!d.open || d.classList.contains("leaving")) return;
    if (reducedMotion()) return d.close();
    d.classList.add("leaving");
    setTimeout(() => { d.close(); d.classList.remove("leaving"); }, 320);
  }

  function showMessage(msg: string) {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4500);
  }

  function fly(email: string) {
    const s = sky.current!, d = dlg.current!;
    const r = bird.current!.getBoundingClientRect();
    const w = r.width, h = r.height;
    const flyer = document.createElement("div");
    flyer.className = "bird flyer";
    flyer.style.width = `${w}px`;
    flyer.style.transform = `translate(${r.left}px,${r.top}px)`;
    flyer.innerHTML = BIRD_HTML;
    s.replaceChildren(flyer);
    try { s.showPopover(); } catch { d.close(); }
    bird.current!.style.visibility = "hidden";

    const finish = () => {
      try { s.hidePopover(); } catch {}
      s.replaceChildren();
      showMessage(`You’re on the list. We’ll email ${email} when Wrenyn launches.`);
    };
    if (reducedMotion()) { close(); finish(); return; }
    setTimeout(close, 240);

    const vw = innerWidth, vh = innerHeight, x0 = r.left, y0 = r.top;
    const P = [[x0, y0], [x0 - vw * 0.06, y0 - vh * 0.42], [x0 + vw * 0.42, y0 + vh * 0.12], [vw + w * 3, -vh * 0.12 - h * 3]];
    const bez = (t: number, j: number) => {
      const m = 1 - t;
      return m * m * m * P[0][j] + 3 * m * m * t * P[1][j] + 3 * m * t * t * P[2][j] + t * t * t * P[3][j];
    };
    const dbez = (t: number, j: number) => {
      const m = 1 - t;
      return 3 * m * m * (P[1][j] - P[0][j]) + 6 * m * t * (P[2][j] - P[1][j]) + 3 * t * t * (P[3][j] - P[2][j]);
    };
    const T0 = performance.now(), DUR = 2100;
    let lastSpark = 0, burst = false;

    const step = (now: number) => {
      const e = Math.min((now - T0) / DUR, 1);
      const crouch = e < 0.14 ? Math.sin((e / 0.14) * Math.PI) : 0;
      const q = e < 0.14 ? 0 : (e - 0.14) / 0.86;
      const eased = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
      const t = 0.35 * q + 0.65 * eased;
      const X = bez(t, 0), Y = bez(t, 1) + crouch * 9;
      const rot = e < 0.14 ? 7 * crouch : Math.max(-30, Math.min(20, Math.atan2(dbez(t, 1), dbez(t, 0)) * 57.3 * 0.5));
      const sc = (1 + 1.5 * Math.sin((Math.min(q / 0.4, 1) * Math.PI) / 2)) * (1 - 0.55 * Math.max(0, (q - 0.5) / 0.5));
      flyer.style.transform = `translate(${X}px,${Y}px) rotate(${rot}deg) scale(${sc})`;
      const cx = X + w / 2, cy = Y + h / 2;
      if (e >= 0.14 && !burst) { burst = true; for (let i = 0; i < 18; i++) spark(s, cx, cy, true); }
      if (e >= 0.14 && now - lastSpark > 26) { lastSpark = now; spark(s, cx - w * 0.25 * sc, cy + h * 0.2 * sc, false); }
      if (e < 1) requestAnimationFrame(step);
      else setTimeout(finish, 250);
    };
    requestAnimationFrame(step);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busyRef.current) return;
    const email = input.current!.value.trim().toLowerCase();
    if (!GMAIL.test(email)) {
      setError("Enter a valid Gmail address, like name@gmail.com.");
      input.current!.focus();
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn’t save right now. Please try again in a moment.");
    } catch (err) {
      busyRef.current = false;
      setBusy(false);
      setError(err instanceof TypeError ? "Couldn’t reach the server. Check your connection and try again." : (err as Error).message);
      return;
    }
    try { localStorage.setItem(KEY, email); } catch {}
    input.current!.blur();
    setJoined(email);
    fly(email);
  }

  return (
    <>
      <button className={`btn${joined ? " done" : ""}`} type="button" onClick={open}>
        {joined ? "You’re on the waitlist" : "Join waitlist"}
      </button>

      <dialog
        ref={dlg}
        aria-labelledby="wl-title"
        onCancel={(e) => { e.preventDefault(); if (!busyRef.current) close(); }}
        onClick={(e) => { if (e.target === dlg.current && !busyRef.current) close(); }}
      >
        <button className="close" type="button" onClick={close} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="dlg-head">
          <div className="badge"><BirdMark ref={bird} /></div>
          <h2 id="wl-title">Join the waitlist</h2>
          <p>Enter your Gmail address and we’ll email you when Wrenyn opens up.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="wl-email">Gmail address</label>
          <input ref={input} id="wl-email" type="email" inputMode="email" autoComplete="email" placeholder="name@gmail.com" required />
          <p className="err" role="alert">{error}</p>
          <button className="btn submit" type="submit" disabled={busy}>{busy ? "Joining…" : "Join waitlist"}</button>
        </form>
      </dialog>

      <div className="sky" ref={sky} popover="manual" aria-hidden="true" />

      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        <span className="tick">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#202322" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
