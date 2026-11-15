import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Hills from "./components/Hills";
import { ContactButton } from "./components/Contact";

export default function Home() {
  return <div className="wrenyn-home">
    <a className="company-skip" href="#main-content">Skip to content</a>
    <SiteHeader solid />
    <main id="main-content" className="company-main">
      <section className="company-hero">
        <div className="company-landscape" aria-hidden="true"><Hills /><div /></div>
        <div className="company-hero-copy">
          <p className="co-kicker">SOFTWARE BY WRENYN</p>
          <h1>Tools for people<br /><span>building what comes next.</span></h1>
          <p>We build practical software for developers, teams, and companies. Focused products that make everyday work simpler, from the first idea to the next release.</p>
          <div className="company-actions"><ContactButton>Talk to Wrenyn <span aria-hidden="true">&#8599;</span></ContactButton><Link className="company-text-link" href="/company">How we build <span aria-hidden="true">&#8594;</span></Link></div>
        </div>
        <div className="company-hero-caption"><span>DEVELOPERS / TEAMS / COMPANIES</span><span>Independent products. One shared standard.</span></div>
      </section>
      <section className="company-section company-point"><p className="co-kicker">OUR FOCUS</p><div><h2>Better ways to do<br />the work you do every day.</h2><p>We look for the tasks that take too many steps, the tools that lose context, and the handoffs that slow a team down. Then we build a product around making that work easier.</p><Link className="company-text-link" href="/company">Meet the company <span aria-hidden="true">&#8594;</span></Link></div></section>
      <section className="company-section company-conversation"><div><p className="co-kicker">BUILD WITH US</p><h2>Tell us what<br />should work better.</h2><p>Have a problem your team keeps working around? Leave us a message and your email. Let’s start there.</p></div><ContactButton>Share your idea <span aria-hidden="true">&#8599;</span></ContactButton></section>
    </main><SiteFooter />
  </div>;
}
