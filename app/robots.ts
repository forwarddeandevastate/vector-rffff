import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vector-rf.ru";

  return {
    rules: [
      {
        userAgent: "Yandex",
        allow: ["/", "/sitemap-yandex.xml"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/_next", "/_next/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml"],
        disallow: ["/admin", "/admin/", "/api", "/api/", "/_next", "/_next/"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-yandex.xml`],
  };
}