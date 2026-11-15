import type { Metadata } from "next";
import CompanyShell from "../../components/CompanyShell";
import KexozLogo from "../../components/KexozLogo";
import KexozPreview from "../../components/KexozPreview";

const quickstart = "https://kexoz.dev/docs#quickstart";

export const metadata: Metadata = {
  title: "Kexoz",
  description: "Kexoz by Wrenyn — share local builds, collect review feedback, keep the same URL while you fix. Product site: kexoz.dev.",
  openGraph: {
    title: "Kexoz · Wrenyn",
    description: "Share local builds. Pin feedback on the live page. Keep the same URL while you fix.",
    url: "https://wrenyn.com/products/kexoz",
    images: [{ url: "/brand/kexoz-og.jpg", width: 1200, height: 630, alt: "Kexoz by Wrenyn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kexoz · Wrenyn",
    description: "Share local builds. Pin feedback on the live page. Keep the same URL while you fix.",
    images: ["/brand/kexoz-og.jpg"],
  },
};

export default function KexozProductPage() {
  return (
    <CompanyShell glow="product">
      <section className="kx-intro" aria-labelledby="kx-intro-title">
        <div className="kx-intro-inner">
          <div className="kx-intro-brand"><KexozLogo size={30} /><span>Kexoz</span><span className="kx-intro-divider" /> <span className="kx-intro-byline">by Wrenyn</span></div>
          <p className="co-kicker">LOCAL DEVELOPMENT, SHARED</p>
          <h1 id="kx-intro-title">Build locally.<br /><span>Bring people closer.</span></h1>
          <p>Give your local app a public link. Let teammates try the real thing, pin feedback on the page, and review the next fix with you.</p>
          <div className="kx-intro-actions">
            <a className="kx-intro-link" href={quickstart}>Start with Kexoz <span aria-hidden="true">&#8599;</span></a>
          </div>
        </div>
      </section>

      <div className="kx-facts" aria-label="Kexoz at a glance"><span><small>WORKS FROM</small>Desktop & terminal</span><span><small>REVIEWERS USE</small>Their browser</span><span><small>YOUR CODE STAYS</small>On your machine</span></div>

      <section className="kx-workflow" aria-labelledby="workflow-title">
        <div className="kx-workflow-heading">
          <h2 id="workflow-title">See where feedback belongs.</h2>
          <p>Open a note from the feedback list or select its pin on the page to see what the reviewer flagged.</p>
        </div>
        <KexozPreview />
      </section>

      <section className="company-section kx-scenarios"><div><p className="co-kicker">BUILT FOR THE IN-BETWEEN</p><h2>Useful before<br />the next deployment.</h2></div><div><a href="https://kexoz.dev/use-cases#reviews"><strong>Review a working interface</strong><span>Design feedback, without guessing from screenshots.</span><b aria-hidden="true">↗</b></a><a href="https://kexoz.dev/use-cases#webhooks"><strong>Test an integration locally</strong><span>A public endpoint for your local API.</span><b aria-hidden="true">↗</b></a><a href="https://kexoz.dev/use-cases#clients"><strong>Walk a client through the build</strong><span>Share progress while the work is taking shape.</span><b aria-hidden="true">↗</b></a></div></section>

      <section className="kx-closing" aria-labelledby="closing-title">
        <span className="kx-closing-eyebrow">Less setup. More useful feedback.</span>
        <h2 id="closing-title">Let someone try what<br />you’re building.</h2>
        <p>Start with the app already running on your machine.</p>
        <a className="btn kx-closing-button" href={quickstart}>Open the quickstart <span aria-hidden="true">&#8599;</span></a>
      </section>
    </CompanyShell>
  );
}
