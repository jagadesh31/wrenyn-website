import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "../../components/CompanyShell";
import { ContactButton } from "../../components/Contact";
export const metadata: Metadata = { title: "Ochiro — Coming soon", description: "Ochiro is in development at Wrenyn. Share what you would like us to build." };
export default function OchiroPage() {
  return <CompanyShell><section className="company-section company-page-intro ochiro-intro"><p className="co-kicker">OCHIRO / COMING SOON</p><h1>Another idea.<br /><span>Taking shape.</span></h1><p>Ochiro is in development. We’ll share what it does when it’s ready to show. Until then, tell us about the developer workflows you’d like to improve.</p><div className="company-actions"><ContactButton>Share an idea <span>↗</span></ContactButton><Link className="company-text-link" href="/products/kexoz">Explore Kexoz →</Link></div></section></CompanyShell>;
}

