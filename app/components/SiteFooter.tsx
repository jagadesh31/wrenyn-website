import Link from "next/link";
import BirdMark from "./BirdMark";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <Link className="brand brand-sm" href="/" aria-label="Wrenyn">
          <BirdMark />
          <span>wrenyn</span>
        </Link>
        <p>Developer tools that just work.</p>
      </div>
      <nav className="site-footer-links" aria-label="Footer">
        <Link href="/products">Products</Link>
        <Link href="/products/kexoz">Kexoz</Link>
        <Link href="/about">About</Link>
        <a href="https://kexoz.dev" target="_blank" rel="noreferrer">kexoz.dev</a>
      </nav>
      <p className="site-footer-copy">© {new Date().getFullYear()} Wrenyn</p>
    </footer>
  );
}
