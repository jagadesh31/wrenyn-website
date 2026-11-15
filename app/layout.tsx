import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./site.css";
import "./company.css";
import "./brand.css";
import { ContactProvider } from "./components/Contact";

const heading = localFont({ src: "./fonts/space-grotesk-latin-variable.woff2", weight: "300 700", display: "swap", variable: "--font-heading" });
const mono = localFont({ src: [{ path: "./fonts/ibm-plex-mono-400.woff2", weight: "400" }, { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500" }], display: "swap", variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wrenyn.com"),
  title: {
    default: "Wrenyn – Developer tools that just work",
    template: "%s · Wrenyn",
  },
  description: "Wrenyn builds focused tools for developers and the teams around them. Explore Kexoz, share an idea, or tell us what your workflow needs.",
  icons: { icon: "/wrenyn-logo.png", apple: "/wrenyn-logo.png" },
  openGraph: {
    siteName: "Wrenyn",
    type: "website",
    images: [{ url: "/wrenyn-logo.png", alt: "Wrenyn" }],
  },
  twitter: {
    card: "summary",
    images: ["/wrenyn-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#202322",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${mono.variable}`}>
      <body><ContactProvider>{children}</ContactProvider></body>
    </html>
  );
}
