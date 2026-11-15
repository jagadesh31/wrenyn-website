import Link from "next/link";
import BirdMark from "./BirdMark";
export default function SiteFooter() {
  return <footer className="company-footer">
    <div><Link className="brand" href="/" aria-label="Wrenyn home"><BirdMark /><span>wrenyn</span></Link><p>Tools for the work<br />you want to be doing.</p></div>
    <nav aria-label="Products"><h2>Products</h2><Link href="/products/kexoz">Kexoz <span>↗</span></Link><Link href="/products/ochiro">Ochiro <small>Coming soon</small></Link></nav>
    <nav aria-label="Company"><h2>Wrenyn</h2><Link href="/company">Our approach</Link><Link href="/contact">Contact</Link><Link href="/privacy">Your information</Link></nav>
    <div className="company-footer-bottom"><span>© {new Date().getFullYear()} Wrenyn</span><span>Built with purpose. Open to ideas.</span></div>
  </footer>;
}
