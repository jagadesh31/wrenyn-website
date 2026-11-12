import type { Metadata } from "next";
import Link from "next/link";
import BirdMark from "../components/BirdMark";
import CompanyShell from "../components/CompanyShell";
import KexozLogo from "../components/KexozLogo";

export const metadata: Metadata = {
  title: "About",
  description: "Wrenyn builds focused developer tools. Kexoz is our first product, hosted on kexoz.dev.",
};

export default function AboutPage() {
  return (
    <CompanyShell glow="center">
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <p className="co-kicker">About</p>
          <div className="ab-wordmark">
            <BirdMark />
            <h1>wrenyn</h1>
          </div>
          <p className="ab-lead">
            We build developer tools that stay small, sharp, and useful — starting with live preview and review.
          </p>
          <div className="co-actions">
            <Link className="btn" href="/products">Explore products</Link>
            <a className="btn-ghost" href="https://kexoz.dev">Open Kexoz</a>
          </div>
        </div>
      </section>

      <section className="ab-story">
        <div className="ab-story-grid">
          <div>
            <h2>Why Wrenyn exists</h2>
            <p>
              Everyday engineering is full of friction that doesn’t need another mega-platform.
              We make focused tools for the jobs you already do — share a build, collect feedback, keep control.
            </p>
          </div>
          <div>
            <h2>How the brand works</h2>
            <p>
              <strong>wrenyn.com</strong> is the company home. Products can live on their own domains when the job needs it.
              Kexoz runs on <a href="https://kexoz.dev">kexoz.dev</a> for preview links, installs, and accounts.
            </p>
          </div>
        </div>
      </section>

      <section className="ab-product">
        <div className="ab-product-inner">
          <div>
            <p className="co-kicker">First product</p>
            <div className="kx-hero-brand kx-hero-brand-sm">
              <KexozLogo size={48} />
              <h2>Kexoz</h2>
            </div>
            <p>
              Share a local build with your team. Pin notes on the live page. Keep the same URL while you fix — then stop sharing anytime.
            </p>
            <div className="co-actions">
              <Link className="btn" href="/products/kexoz">Kexoz on Wrenyn</Link>
              <a className="btn-ghost" href="https://kexoz.dev">Go to kexoz.dev</a>
            </div>
          </div>
          <ul className="ab-points">
            <li><strong>Studio</strong><span>Brand, products, waitlist</span></li>
            <li><strong>Product domains</strong><span>Where the tool actually runs</span></li>
            <li><strong>What’s next</strong><span>More focused tools over time</span></li>
          </ul>
        </div>
      </section>
    </CompanyShell>
  );
}
