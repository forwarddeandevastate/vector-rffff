import { CITY_LANDINGS } from "@/lib/city-landings";
import { BLOG_POSTS } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";
import { buildSeoRoutes } from "@/lib/seo-routes";

export const REVALIDATE_SITEMAP_SECONDS = 86400;
export const MAX_ROUTE_URLS = 10000;
export const ROUTES_PER_SITEMAP = 5000;

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
  "/about": 0.5,
  "/corporate": 0.68,
  "/requisites": 0.25,
  "/privacy": 0.2,
  "/personal-data": 0.2,
  "/agreement": 0.2,
  "/sitemap-page": 0.3,
};

export type SitemapUrlEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

function dedupe<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export function getLastModified(): Date {
  return new Date(process.env.SITE_LAST_MODIFIED ?? "2025-04-15T00:00:00Z");
}

export function getSitemapIds(): string[] {
  const totalRouteSitemaps = Math.max(1, Math.ceil(MAX_ROUTE_URLS / ROUTES_PER_SITEMAP));
  return [
    "core",
    ...Array.from({ length: totalRouteSitemaps }, (_, i) => `routes-${i + 1}`),
  ];
}

export function buildStaticEntries(lastModified: Date): SitemapUrlEntry[] {
  return STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: STATIC_PRIORITIES[path] ?? 0.5,
  }));
}

export function buildBlogEntries(lastModified: Date): SitemapUrlEntry[] {
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

export function buildCityEntries(lastModified: Date): SitemapUrlEntry[] {
  return CITY_LANDINGS.map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.72,
  }));
}

export function buildRouteEntries(lastModified: Date): SitemapUrlEntry[] {
  return buildSeoRoutes(MAX_ROUTE_URLS).map((route) => ({
    url: absoluteUrl(`/${route.from}/${route.to}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.64,
  }));
}

export function getSitemapEntriesById(id: string): SitemapUrlEntry[] {
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
    if (!Number.isFinite(pageIndex) || pageIndex < 0) {
      return [];
    }

    const allRoutes = buildRouteEntries(lastModified);
    const start = pageIndex * ROUTES_PER_SITEMAP;
    const end = start + ROUTES_PER_SITEMAP;
    return dedupe(allRoutes.slice(start, end));
  }

  return [];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderUrlSet(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [
        `<loc>${escapeXml(entry.url)}</loc>`,
        entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : "",
        entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : "",
        typeof entry.priority === "number" ? `<priority>${entry.priority.toFixed(1)}</priority>` : "",
      ].filter(Boolean);

      return `<url>${parts.join("")}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function renderSitemapIndex(ids: string[]): string {
  const lastmod = getLastModified().toISOString();
  const items = ids
    .map((id) => `<sitemap><loc>${escapeXml(absoluteUrl(`/sitemap/${id}.xml`))}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
