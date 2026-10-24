import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wrenyn.com"),
  title: "Wrenyn – Developer tools that just work",
  description: "Fast, focused tools for the work you do every day as a developer. Join the waitlist for early access.",
  icons: { icon: "/wrenyn-logo.png", apple: "/wrenyn-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#202322",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
