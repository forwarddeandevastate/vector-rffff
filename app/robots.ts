import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vector-rf.ru";

  return {
    rules: [
      {
        userAgent: "Yandex",
        disallow: [
          "/admin",
          "/api",
          "/_next",
          "/*?etext=",   // 🔥 запрет параметра etext
        ],
      },
      {
        userAgent: "*",
        disallow: [
          "/admin",
          "/api",
          "/_next",
          "/*?etext=",   // 🔥 запрет параметра etext
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}