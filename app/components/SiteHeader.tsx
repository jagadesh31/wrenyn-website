import Link from "next/link";
import BirdMark from "./BirdMark";
import KexozLogo from "./KexozLogo";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
] as const;

export default function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header className={`site-header${solid ? " is-solid" : ""}`}>
      <Link className="brand" href="/" aria-label="Wrenyn">
        <BirdMark />
        <span>wrenyn</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="site-nav-link">
            {link.label}
          </Link>
        ))}
        <a className="site-nav-cta site-nav-cta-kexoz" href="https://kexoz.dev" target="_blank" rel="noreferrer">
          <KexozLogo size={18} />
          Open Kexoz
        </a>
      </nav>
    </header>
  );
}
