import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "../components/CompanyShell";
import { ContactButton } from "../components/Contact";
export const metadata: Metadata = { title: "Our approach", description: "Why Wrenyn builds focused tools for developers and the teams around them." };
export default function CompanyPage() {
  return <CompanyShell><section className="company-section company-page-intro"><p className="co-kicker">THE COMPANY BEHIND THE TOOLS</p><h1>Good tools give<br /><span>you time back.</span></h1><p>Wrenyn builds software for developers and the people they work with. We start with the awkward parts of everyday work, then build a clearer way through.</p></section>
    <section className="company-section company-point"><p className="co-kicker">STARTING WITH KEXOZ</p><div><h2>A shorter path<br />from building to feedback.</h2><p>A local app can be ready for a conversation long before it’s ready for deployment. Kexoz gives it a shareable link and puts review feedback on the page, where it belongs.</p><Link className="company-text-link" href="/products/kexoz">Explore Kexoz <span>→</span></Link></div></section>
    <section className="company-section company-principles"><p className="co-kicker">HOW WE MAKE DECISIONS</p>{[
      ["01", "Start with the work.", "A useful product solves a recurring problem. We care about the steps it removes, the context it preserves, and the time it gives back."],
      ["02", "Make the next step clear.", "People should know what a tool does, what it needs from them, and what happens next. Clear language is part of the product."],
      ["03", "Build with the people using it.", "Questions, rough edges, and feature requests help us decide what deserves attention. We want to hear where your workflow breaks down."],
    ].map(([number, title, text]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</section>
    <section className="company-section company-conversation"><div><h2>Bring us a real problem.</h2><p>We’re listening to developers, teams, and companies.</p></div><ContactButton>Talk to Wrenyn <span>↗</span></ContactButton></section>
  </CompanyShell>;
}

