import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Hills from "./components/Hills";
import KexozLogo from "./components/KexozLogo";
import { ContactButton } from "./components/Contact";

export default function Home() {
  return <div className="wrenyn-home">
    <a className="company-skip" href="#main-content">Skip to content</a>
    <SiteHeader solid />
    <main id="main-content" className="company-main" tabIndex={-1}>
      <section className="company-hero">
        <div className="company-landscape" aria-hidden="true"><Hills /><div /></div>
        <div className="company-hero-copy">
          <p className="co-kicker">SOFTWARE BY WRENYN</p>
          <h1>Tools for people<br /><span>building what comes next.</span></h1>
          <p>We build focused software for developers and their teams. Start with Kexoz: share your local app, gather feedback on the page, and keep building.</p>
          <div className="company-actions"><Link className="btn" href="/products/kexoz">Explore Kexoz <span aria-hidden="true">&#8594;</span></Link><a className="company-text-link" href="#products">See our products <span aria-hidden="true">&#8595;</span></a></div>
        </div>
        <div className="company-hero-caption"><span>DEVELOPERS / TEAMS / COMPANIES</span><span>Independent products. One shared standard.</span></div>
      </section>
      <section id="products" className="company-section company-products" aria-labelledby="products-title">
        <p className="co-kicker">OUR PRODUCTS</p><h2 id="products-title">A shorter path to useful work.</h2>
        <article className="company-featured-product" aria-labelledby="kexoz-title">
          <div className="company-product-copy">
            <div className="company-product-identity"><KexozLogo size={40} /><h3 id="kexoz-title">Kexoz</h3><span className="company-product-status">Available now</span></div>
            <h4>Your local build.<br />Ready for a second opinion.</h4>
            <p>Give teammates or clients an HTTPS link to the app running on your machine. They can try it in their browser and pin feedback exactly where it belongs.</p>
            <div className="company-actions"><a className="btn" href="https://kexoz.dev/docs#quickstart">Start with Kexoz <span aria-hidden="true">&#8599;</span></a><Link className="company-text-link" href="/products/kexoz">How it works <span aria-hidden="true">&#8594;</span></Link></div>
            <p className="company-product-note">Share from desktop or terminal. Review in the browser.</p>
          </div>
          <ol className="company-product-steps" aria-label="The Kexoz workflow">
            <li><span aria-hidden="true">01</span><div><h4>Share the running app</h4><p>Turn localhost into a link you can send.</p></div></li>
            <li><span aria-hidden="true">02</span><div><h4>Get feedback in context</h4><p>Keep review notes attached to the page.</p></div></li>
            <li><span aria-hidden="true">03</span><div><h4>Make the next fix</h4><p>Update locally and continue the review.</p></div></li>
          </ol>
        </article>
        <div className="company-upcoming-product"><div><span className="co-kicker">WHAT'S NEXT</span><h3>Ochiro <span>Coming soon</span></h3><p>Our next product is in development. More details when it's ready.</p></div><Link className="company-text-link" href="/products/ochiro">About Ochiro <span aria-hidden="true">&#8594;</span></Link></div>
      </section>
      <section className="company-section company-point"><p className="co-kicker">OUR FOCUS</p><div><h2>Better ways to do<br />the work you do every day.</h2><p>We look for the tasks that take too many steps, the tools that lose context, and the handoffs that slow a team down. Then we build a product around making that work easier.</p><Link className="company-text-link" href="/company">Meet the company <span aria-hidden="true">&#8594;</span></Link></div></section>
      <section className="company-section company-conversation"><div><p className="co-kicker">BUILD WITH US</p><h2>Tell us what<br />should work better.</h2><p>Have a problem your team keeps working around? Leave us a message and your email. Let’s start there.</p></div><ContactButton>Share your idea <span aria-hidden="true">&#8599;</span></ContactButton></section>
    </main><SiteFooter />
  </div>;
}
