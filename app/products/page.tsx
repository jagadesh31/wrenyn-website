import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "../components/CompanyShell";
import KexozLogo from "../components/KexozLogo";
import KexozPreview from "../components/KexozPreview";

export const metadata: Metadata = {
  title: "Products",
  description: "Products from Wrenyn. Kexoz for live preview review lives on kexoz.dev.",
  openGraph: {
    title: "Products · Wrenyn",
    description: "Focused developer tools from Wrenyn. Kexoz for live preview review on kexoz.dev.",
    url: "https://wrenyn.com/products",
    images: [{ url: "/brand/kexoz-og.jpg", width: 1200, height: 630, alt: "Kexoz by Wrenyn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products · Wrenyn",
    description: "Focused developer tools from Wrenyn. Kexoz for live preview review on kexoz.dev.",
    images: ["/brand/kexoz-og.jpg"],
  },
};

export default function ProductsPage() {
  return (
    <CompanyShell glow="product">
      <section className="pr-hero">
        <div className="pr-hero-inner">
          <p className="co-kicker">Products</p>
          <h1>What Wrenyn ships</h1>
          <p className="pr-lead">
            Each product does one job well. The company lives here — the product runs where the workflow needs it.
          </p>
        </div>
      </section>

      <section className="pr-feature">
        <div className="pr-feature-inner">
          <div className="pr-feature-copy">
            <p className="co-kicker">Available now</p>
            <div className="kx-hero-brand kx-hero-brand-sm">
              <KexozLogo size={44} />
              <h2>Kexoz</h2>
            </div>
            <p>
              Live preview and review for unfinished work. Share localhost, collect pins on the page, keep the same URL while you ship fixes.
            </p>
            <ul className="pr-list">
              <li>Web shares with visual review</li>
              <li>Versions and client review links</li>
              <li>Password gates and instant stop</li>
              <li>Mobile preview coming soon</li>
            </ul>
            <div className="co-actions">
              <Link className="btn" href="/products/kexoz">View product</Link>
              <a className="btn-ghost" href="https://kexoz.dev">kexoz.dev</a>
            </div>
          </div>
          <KexozPreview />
        </div>
      </section>

      <section className="pr-domains">
        <div className="pr-domains-inner">
          <h2>Two layers, one studio</h2>
          <div className="pr-domains-grid">
            <div>
              <h3>wrenyn.com</h3>
              <p>Company story, product directory, and waitlist.</p>
            </div>
            <div>
              <h3>kexoz.dev</h3>
              <p>Downloads, docs, billing, and live preview addresses.</p>
            </div>
          </div>
        </div>
      </section>
    </CompanyShell>
  );
}
