import type { MetadataRoute } from "next";
import { buildSeoRouteUrls } from "@/lib/seo-routes";

export default function sitemapYandex(): MetadataRoute.Sitemap {
  const baseUrl = "https://vector-rf.ru";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
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
  ];

  // Яндекс — до 500 маршрутов
  const routeUrls = buildSeoRouteUrls(baseUrl, 500);

  const routePages: MetadataRoute.Sitemap = routeUrls.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.45,
  }));

  return [...staticPages, ...routePages];
}