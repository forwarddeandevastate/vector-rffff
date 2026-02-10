import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vector-rf.ru";

  return {
    rules: [
      {
        userAgent: "Yandex",
        disallow: ["/admin", "/api", "/_next"],
      },
      {
        userAgent: "*",
        disallow: ["/admin", "/api", "/_next"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // host в MetadataRoute.Robots не обязателен, и Next его не всегда пишет в robots.txt
  };
}