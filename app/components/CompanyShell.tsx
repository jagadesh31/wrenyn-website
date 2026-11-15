import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function CompanyShell({
  children,
  glow = "left",
}: {
  children: ReactNode;
  glow?: "left" | "center" | "product";
}) {
  return (
    <div className={`co-shell co-glow-${glow}`}>
      <a className="company-skip" href="#main-content">Skip to content</a>
      <SiteHeader solid />
      <main id="main-content" className="co-main" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </div>
  );
}
