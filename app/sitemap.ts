import type { MetadataRoute } from "next";
import { buildSeoRouteUrls } from "@/lib/seo-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vector-rf.ru";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    // SEO услуги
    {
      url: `${baseUrl}/city`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/city-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airport-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/intercity-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/minivan-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/corporate-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    // Остальные страницы
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/corporate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/thanks`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // 500 SEO-маршрутов /route/from/to
  const routeUrls = buildSeoRouteUrls(baseUrl, 2000);

  const routePages: MetadataRoute.Sitemap = routeUrls.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly",
    // не ставим 1.0, чтобы не “конфликтовать” с главной
    priority: 0.45,
  }));

  return [...staticPages, ...routePages];
}