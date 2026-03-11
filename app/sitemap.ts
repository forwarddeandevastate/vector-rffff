import type { MetadataRoute } from "next";

import { CITY_LANDINGS } from "@/lib/city-landings";
import { absoluteUrl } from "@/lib/seo";
import { buildSeoRoutes } from "@/lib/seo-routes";
import { BLOG_POSTS } from "@/lib/blog";

// ISR: пересобираем sitemap раз в сутки
export const revalidate = 86400;

// Статические страницы для индексации
const STATIC_PATHS = [
  "/",
  "/services",
  "/city",
  "/intercity-taxi",
  "/airport-transfer",
  "/city-transfer",
  "/minivan-transfer",
  "/corporate-taxi",
  "/corporate",
  "/about",
  "/sitemap-page",
  "/contacts",
  "/reviews",
  "/faq",
  "/prices",
  "/requisites",
  "/privacy",
  "/personal-data",
  "/agreement",
  "/taxi-mezhgorod",
  "/mezhdugorodnee-taksi",
  "/transfer-v-aeroport",
  "/transfer-iz-aeroporta",
] as const;

const STATIC_PRIORITIES: Partial<Record<(typeof STATIC_PATHS)[number], number>> = {
  "/": 1.0,
  "/services": 0.82,
  "/intercity-taxi": 0.92,
  "/airport-transfer": 0.90,
  "/taxi-mezhgorod": 0.88,
  "/mezhdugorodnee-taksi": 0.88,
  "/transfer-v-aeroport": 0.88,
  "/transfer-iz-aeroporta": 0.88,
  "/city": 0.78,
  "/prices": 0.75,
  "/city-transfer": 0.74,
  "/corporate-taxi": 0.74,
  "/minivan-transfer": 0.72,
  "/reviews": 0.65,
  "/faq": 0.62,
  "/contacts": 0.58,
  "/about": 0.50,
  "/corporate": 0.68,
  "/requisites": 0.25,
  "/privacy": 0.20,
  "/personal-data": 0.20,
  "/agreement": 0.20,
  "/sitemap-page": 0.30,
};

// Контролируемый rollout маршрутов
// После 2-3 недель индексации поднять до 20000 → 45000
const MAX_ROUTE_URLS = 10000;
const ROUTES_PER_SITEMAP = 5000;

function dedupe<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function getLastModified(): Date {
  return new Date(process.env.SITE_LAST_MODIFIED ?? "2025-04-15T00:00:00Z");
}

function buildStaticEntries(lastModified: Date): MetadataRoute.Sitemap {
  return STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: STATIC_PRIORITIES[path] ?? 0.5,
  }));
}

function buildBlogEntries(lastModified: Date): MetadataRoute.Sitemap {
  const blogPage = {
    url: absoluteUrl("/blog"),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  };
  const posts = BLOG_POSTS.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));
  return [blogPage, ...posts];
}

function buildCityEntries(lastModified: Date): MetadataRoute.Sitemap {
  return CITY_LANDINGS.map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));
}

function buildRouteEntries(lastModified: Date): MetadataRoute.Sitemap {
  return buildSeoRoutes(MAX_ROUTE_URLS).map((route) => ({
    url: absoluteUrl(`/${route.from}/${route.to}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.64,
  }));
}

// generateSitemaps → генерирует:
//   /sitemap/core.xml   — статика + блог + города (~300 URL)
//   /sitemap/routes-1.xml — маршруты 1–5000
//   /sitemap/routes-2.xml — маршруты 5001–10000
// /sitemap.xml — автоматический index от Next.js
export async function generateSitemaps() {
  const totalRouteSitemaps = Math.max(
    1,
    Math.ceil(MAX_ROUTE_URLS / ROUTES_PER_SITEMAP)
  );

  return [
    { id: "core" },
    ...Array.from({ length: totalRouteSitemaps }, (_, i) => ({
      id: `routes-${i + 1}`,
    })),
  ];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const lastModified = getLastModified();

  if (id === "core") {
    return dedupe([
      ...buildStaticEntries(lastModified),
      ...buildBlogEntries(lastModified),
      ...buildCityEntries(lastModified),
    ]);
  }

  if (id.startsWith("routes-")) {
    const pageIndex = Number(id.replace("routes-", "")) - 1;
    const allRoutes = buildRouteEntries(lastModified);
    const start = pageIndex * ROUTES_PER_SITEMAP;
    const end = start + ROUTES_PER_SITEMAP;
    return dedupe(allRoutes.slice(start, end));
  }

  return [];
}
