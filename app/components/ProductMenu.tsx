"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import KexozLogo from "./KexozLogo";

export default function ProductMenu() {
  const disclosure = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (disclosure.current && !disclosure.current.contains(event.target as Node)) disclosure.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      const menu = disclosure.current;
      if (event.key !== "Escape" || !menu?.open) return;
      menu.open = false;
      if (menu.contains(document.activeElement)) menu.querySelector("summary")?.focus();
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return <details className="product-menu" ref={disclosure}
    onPointerEnter={event => { if (event.pointerType === "mouse") event.currentTarget.open = true; }}
    onPointerLeave={event => { if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false; }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
    <summary className="site-nav-link product-menu-trigger">Products <svg className="product-menu-chevron" aria-hidden="true" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" /></svg></summary>
    <div className="product-menu-panel" onClick={event => { if ((event.target as Element).closest("a") && disclosure.current) disclosure.current.open = false; }}>
      <p className="product-menu-label">BUILT BY WRENYN</p>
      <Link href="/products/kexoz" className="product-menu-item"><KexozLogo size={36} /><span className="product-menu-copy"><strong>Kexoz</strong><small>Share builds. Gather feedback.</small></span><span className="product-menu-arrow">&#8594;</span></Link>
      <Link href="/products/ochiro" className="product-menu-item"><span className="product-menu-ochiro">O</span><span className="product-menu-copy"><strong>Ochiro</strong><small>In development.</small></span><em className="product-menu-badge">Coming soon</em></Link>
    </div>
  </details>;
}
