import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://clinic.example.com";
  const routes = ["/", "/services", "/doctors", "/about", "/contact", "/booking", "/login", "/register", "/privacy", "/terms"];
  const out: MetadataRoute.Sitemap = [];
  for (const locale of ["ar", "en"]) {
    for (const r of routes) {
      out.push({
        url: `${base}/${locale}${r === "/" ? "" : r}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: r === "/" ? 1 : 0.7,
      });
    }
  }
  return out;
}
