import Link from "next/link";
import BirdMark from "./BirdMark";
import ProductMenu from "./ProductMenu";
import { ContactButton } from "./Contact";

export default function SiteHeader({ solid = false, hero = false }: { solid?: boolean; hero?: boolean }) {
  return (
    <header className={hero ? "hero-top" : `site-header${solid ? " is-solid" : ""}`}>
      <Link className="brand" href="/" aria-label="Wrenyn">
        <BirdMark />
        <span>wrenyn</span>
      </Link>
      <nav className={`site-nav${hero ? " hero-nav" : ""}`} aria-label="Primary">
        <ProductMenu />
        <Link className="site-nav-link" href="/company">Company</Link>
        <ContactButton className="site-nav-cta">Let’s talk <span aria-hidden="true">↗</span></ContactButton>
      </nav>
    </header>
  );
}
