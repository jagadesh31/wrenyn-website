import Link from "next/link";
import BirdMark from "./components/BirdMark";
import Hills from "./components/Hills";
import KexozLogo from "./components/KexozLogo";
import ViewerCount from "./components/ViewerCount";
import Waitlist from "./components/Waitlist";

export default function Home() {
  return (
    <section className="hero">
      <Hills />
      <div className="shade" />

      <div className="hero-top">
        <a className="brand" href="/" aria-label="Wrenyn">
          <BirdMark />
          <span>wrenyn</span>
        </a>
        <nav className="site-nav hero-nav" aria-label="Primary">
          <Link href="/products" className="site-nav-link">Products</Link>
          <Link href="/about" className="site-nav-link">About</Link>
          <a className="site-nav-cta site-nav-cta-kexoz" href="https://kexoz.dev" target="_blank" rel="noreferrer">
            <KexozLogo size={18} />
            Open Kexoz
          </a>
        </nav>
      </div>

      <main>
        <h1>Developer tools <span>that just work.</span></h1>
        <p className="sub">
          Wrenyn builds focused tools for everyday engineering work. Our first product, Kexoz, runs on its own domain.
        </p>
        <Waitlist />

        <div className="home-products">
          <h2>First product</h2>
          <Link className="home-product-link" href="/products/kexoz">
            <span className="home-product-brand">
              <KexozLogo size={40} />
              <strong>Kexoz</strong>
            </span>
            <span>Share a local build, collect pins on the live page, and keep the same preview while you fix.</span>
            <span className="home-product-cta">View on Wrenyn →</span>
            <em>kexoz.dev</em>
          </Link>
        </div>
      </main>

      <ViewerCount />
    </section>
  );
}
