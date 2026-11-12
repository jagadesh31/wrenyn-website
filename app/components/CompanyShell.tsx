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
      <SiteHeader solid />
      <main className="co-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
