import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "../../components/CompanyShell";
import KexozLogo from "../../components/KexozLogo";
import KexozPreview from "../../components/KexozPreview";

export const metadata: Metadata = {
  title: "Kexoz",
  description: "Kexoz by Wrenyn — share local builds, collect review feedback, keep the same URL while you fix. Product site: kexoz.dev.",
  openGraph: {
    title: "Kexoz · Wrenyn",
    description: "Share local builds. Pin feedback on the live page. Keep the same URL while you fix.",
    url: "https://wrenyn.com/products/kexoz",
    images: [{ url: "/brand/kexoz-og.jpg", width: 1200, height: 630, alt: "Kexoz by Wrenyn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kexoz · Wrenyn",
    description: "Share local builds. Pin feedback on the live page. Keep the same URL while you fix.",
    images: ["/brand/kexoz-og.jpg"],
  },
};

export default function KexozProductPage() {
  return (
    <CompanyShell glow="product">
      <section className="kx-hero">
        <div className="kx-hero-inner">
          <div className="kx-hero-copy">
            <p className="co-kicker">Product by Wrenyn</p>
            <div className="kx-hero-brand">
              <KexozLogo size={64} />
              <h1>Kexoz</h1>
            </div>
            <p className="kx-hero-lead">
              Share unfinished local builds. Collect pins on the live page. Keep the same preview while you ship the fix.
            </p>
            <div className="co-actions">
              <a className="btn" href="https://kexoz.dev">Open kexoz.dev</a>
              <a className="btn-ghost" href="https://kexoz.dev/docs">Read the docs</a>
            </div>
            <p className="kx-hero-meta">Desktop app · Web shares today · Mobile preview coming soon</p>
          </div>
          <KexozPreview />
        </div>
      </section>

      <section className="kx-band">
        <div className="kx-band-inner">
          <h2>Built for the review loop</h2>
          <p>
            Design, QA, and product open one link. Notes land where the issue is. Eng keeps shipping on the same URL until it’s approved.
          </p>
        </div>
      </section>

      <section className="kx-steps-wrap">
        <div className="kx-steps">
          <article>
            <span className="kx-step-num">01</span>
            <h3>Share the live build</h3>
            <p>Run the desktop app or CLI. Expose localhost on a stable HTTPS address — no deploy required for every review.</p>
          </article>
          <article>
            <span className="kx-step-num">02</span>
            <h3>Pin feedback on the page</h3>
            <p>Reviewers click where something’s wrong. You assign, reply, and mark fixed without losing context in chat.</p>
          </article>
          <article>
            <span className="kx-step-num">03</span>
            <h3>Stop when you’re done</h3>
            <p>Password gates, guest revoke, and stop sharing cut access immediately. Previews stay on your machine.</p>
          </article>
        </div>
      </section>

      <section className="kx-domain">
        <div className="kx-domain-inner">
          <div>
            <p className="co-kicker">Company vs product</p>
            <h2>Wrenyn builds it. kexoz.dev runs it.</h2>
            <p>
              This page is the Wrenyn entry for Kexoz. Downloads, accounts, docs, and preview addresses live on the product domain —
              because share links need their own hostname.
            </p>
          </div>
          <div className="kx-domain-links">
            <a href="https://kexoz.dev">kexoz.dev →</a>
            <a href="https://kexoz.dev/account">Account →</a>
            <a href="https://kexoz.dev/docs">Docs →</a>
            <Link href="/products">All Wrenyn products →</Link>
          </div>
        </div>
      </section>
    </CompanyShell>
  );
}
