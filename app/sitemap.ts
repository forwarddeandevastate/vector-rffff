import type { MetadataRoute } from "next";

import { CITY_LANDINGS } from "@/lib/city-landings";
import { absoluteUrl } from "@/lib/seo";
import { buildSeoRouteUrls } from "@/lib/seo-routes";

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
  "/contacts",
  "/reviews",
  "/faq",
  "/prices",
  "/requisites",
  "/privacy",
  "/personal-data",
  "/agreement",
  "/taxi-mezhgorod",
  "/taksi-mezhgorod",
  "/mezhdugorodnee-taksi",
  "/transfer-v-aeroport",
  "/transfer-iz-aeroporta",
  "/taxi-v-aeroport",
] as const;

const STATIC_PRIORITIES: Partial<Record<(typeof STATIC_PATHS)[number], number>> = {
  "/": 1,
  "/services": 0.95,
  "/intercity-taxi": 0.95,
  "/airport-transfer": 0.92,
  "/city": 0.9,
  "/city-transfer": 0.85,
  "/minivan-transfer": 0.8,
  "/corporate-taxi": 0.8,
  "/corporate": 0.75,
  "/about": 0.7,
  "/contacts": 0.7,
  "/reviews": 0.7,
  "/faq": 0.65,
  "/prices": 0.6,
  "/requisites": 0.4,
  "/privacy": 0.35,
  "/personal-data": 0.35,
  "/agreement": 0.35,
  "/taxi-mezhgorod": 0.93,
  "/taksi-mezhgorod": 0.92,
  "/mezhdugorodnee-taksi": 0.93,
  "/transfer-v-aeroport": 0.92,
  "/transfer-iz-aeroporta": 0.9,
  "/taxi-v-aeroport": 0.92,
};

const ROUTE_CHUNK_SIZE = 5000;
const SEO_ROUTE_URL_LIMIT = 50000;

function buildAllEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const seen = new Set<string>();
  const routeEntries = buildSeoRouteUrls("", SEO_ROUTE_URL_LIMIT).map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: path.split("/").length > 3 ? 0.63 : 0.68,
  }));

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: STATIC_PRIORITIES[path] ?? 0.5,
    })),
    ...CITY_LANDINGS.map((city) => ({
      url: absoluteUrl(`/${city.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...routeEntries,
  ];

  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

export async function generateSitemaps() {
  const total = buildAllEntries().length;
  const chunks = Math.max(1, Math.ceil(total / ROUTE_CHUNK_SIZE));
  return Array.from({ length: chunks }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const entries = buildAllEntries();
  const start = id * ROUTE_CHUNK_SIZE;
  const end = start + ROUTE_CHUNK_SIZE;
  return entries.slice(start, end);
}
