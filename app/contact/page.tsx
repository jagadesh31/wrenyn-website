import type { Metadata } from "next";
import CompanyShell from "../components/CompanyShell";
import { ContactForm } from "../components/Contact";
export const metadata: Metadata = { title: "Contact", description: "Talk to Wrenyn about a product, a developer workflow, or working together." };
export default function ContactPage() {
  return <CompanyShell><section className="company-section company-contact-page"><div className="company-page-intro"><p className="co-kicker">LET’S TALK</p><h1>What are<br /><span>you building?</span></h1><p>Tell us what you need, what isn’t working, or what you wish existed.</p><div className="company-contact-note"><strong>Need help with Kexoz?</strong><p>Include what you tried and any error message. Please leave out passwords, access tokens, and private project data.</p><a className="company-text-link" href="https://kexoz.dev/docs">Browse the documentation ↗</a></div></div><div className="company-form-panel"><ContactForm /></div></section></CompanyShell>;
}

