import Link from "next/link";
import KexozLogo from "./KexozLogo";

export default function ProductMenu() {
  return <details className="product-menu">
    <summary className="site-nav-link product-menu-trigger">Products <svg className="product-menu-chevron" aria-hidden="true" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" /></svg></summary>
    <div className="product-menu-panel">
      <p className="product-menu-label">BUILT BY WRENYN</p>
      <Link href="/products/kexoz" className="product-menu-item"><KexozLogo size={36} /><span className="product-menu-copy"><strong>Kexoz</strong><small>Share builds. Gather feedback.</small></span><span className="product-menu-arrow">&#8594;</span></Link>
      <Link href="/products/ochiro" className="product-menu-item"><span className="product-menu-ochiro">O</span><span className="product-menu-copy"><strong>Ochiro</strong><small>In development.</small></span><em className="product-menu-badge">Coming soon</em></Link>
    </div>
  </details>;
}
