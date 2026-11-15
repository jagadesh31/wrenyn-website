import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "../components/CompanyShell";
export const metadata: Metadata = { title: "Your information", description: "What you share with Wrenyn when you send a contact request." };
export default function InformationPage() {
  return <CompanyShell><article className="company-section company-reading"><p className="co-kicker">CONTACT & INFORMATION</p><h1>What you share with us.</h1><p className="company-reading-lead">A straightforward explanation of the Wrenyn contact form.</p><h2>The details in your message</h2><p>When you contact Wrenyn, we store your email address, your optional name, the topic you select, your message, and its submission time. These details are available to the team through our protected admin inbox so we can respond to your request.</p><h2>Verification and abuse prevention</h2><p>The form uses Cloudflare Turnstile for verification when configured. Request information, including your IP address, is used for verification and submission limits.</p><h2>Contact is not a mailing-list signup</h2><p>Sending a message does not subscribe you to product announcements. The form is for conversations about your request.</p><h2>Need to update or remove a message?</h2><p><Link href="/contact">Contact us</Link> using the email address you submitted and tell us which request you mean.</p><h2>Kexoz has its own information</h2><p>For the Kexoz product and account, see the <a href="https://kexoz.dev/privacy">Kexoz privacy policy</a>.</p></article></CompanyShell>;
}

