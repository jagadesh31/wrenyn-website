import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./site.css";

const heading = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wrenyn.com"),
  title: {
    default: "Wrenyn – Developer tools that just work",
    template: "%s · Wrenyn",
  },
  description: "Wrenyn builds focused developer tools. Kexoz lives on kexoz.dev — share local builds, collect review feedback, ship the next version.",
  icons: { icon: "/wrenyn-logo.png", apple: "/wrenyn-logo.png" },
  openGraph: {
    siteName: "Wrenyn",
    type: "website",
    images: [{ url: "/brand/kexoz-og.jpg", width: 1200, height: 630, alt: "Kexoz by Wrenyn" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/kexoz-og.jpg"],
  },
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
