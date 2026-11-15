import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/company", "/contact", "/products/kexoz", "/products/ochiro", "/privacy"].map(path => ({ url: `https://wrenyn.com${path}` }));
}
