import type { MetadataRoute } from "next";

// Пересобираем sitemap раз в сутки
export const revalidate = 86400;

import { CITY_LANDINGS } from "@/lib/city-landings";
import { absoluteUrl } from "@/lib/seo";
import { buildSeoRoutes } from "@/lib/seo-routes";
import { BLOG_POSTS } from "@/lib/blog";

// Индексируемые keyword-лендинги (не noindex)
const INDEXABLE_KEYWORD_SLUGS = [
  "taxi-mezhgorod",
  "mezhdugorodnee-taksi",
  "transfer-v-aeroport",
  "transfer-iz-aeroporta",
] as const;

// Статические страницы для индексации (без noindex-страниц)
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
  // Индексируемые keyword-лендинги (у них index: true)
  "/taxi-mezhgorod",
  "/mezhdugorodnee-taksi",
  "/transfer-v-aeroport",
  "/transfer-iz-aeroporta",
  // НЕ включаем: /taksi-mezhgorod (noindex → canonical /taxi-mezhgorod)
  // НЕ включаем: /taxi-v-aeroport (noindex → canonical /transfer-v-aeroport)
  // НЕ включаем: /route (noindex, redirect → /city)
  // НЕ включаем: /thanks (noindex)
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
};

const MAX_ROUTE_URLS = 45000;
const ROUTES_PER_SITEMAP = 10000;

function dedupe<T extends { url: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
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
  // /blog страница + каждый пост с реальной датой публикации
  const blogPage = {
    url: absoluteUrl("/blog"),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  };
  const posts = BLOG_POSTS.map((post: { slug: string; updatedAt?: string; publishedAt: string }) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.publishedAt), // реальная дата, не today
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

export async function generateSitemaps() {
  const totalRouteSitemaps = Math.max(
    1,
    Math.ceil(MAX_ROUTE_URLS / ROUTES_PER_SITEMAP)
  );

  return [
    { id: "core" },
    ...Array.from({ length: totalRouteSitemaps }, (_, index) => ({
      id: `routes-${index + 1}`,
    })),
  ];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  // Фиксированная дата последнего релиза — не new Date() чтобы не обманывать краулер
  const lastModified = new Date("2025-04-15T00:00:00Z");

  if (id === "core") {
    return dedupe([
      ...buildStaticEntries(lastModified),
      ...buildBlogEntries(lastModified),
      ...buildCityEntries(lastModified),
    ]);
  }

  if (id.startsWith("routes-")) {
    const pageNumber = Number(id.replace("routes-", ""));
    const pageIndex =
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;

    const allRoutes = buildRouteEntries(lastModified);
    const start = pageIndex * ROUTES_PER_SITEMAP;
    const end = start + ROUTES_PER_SITEMAP;

    return dedupe(allRoutes.slice(start, end));
  }

  return [];
}
