import { getConfig } from "~lib/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const config = getConfig();
  const siteUrl = config.url || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
