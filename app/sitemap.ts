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

// Один стабильный sitemap.xml. Держим запас ниже лимита 50 000 URL.
const MAX_SITEMAP_URLS = 49900;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const seen = new Set<string>();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: STATIC_PRIORITIES[path] ?? 0.5,
  }));

  const cityEntries: MetadataRoute.Sitemap = CITY_LANDINGS.map((city) => ({
    url: absoluteUrl(`/${city.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const reserved = staticEntries.length + cityEntries.length;
  const routeLimit = Math.max(0, MAX_SITEMAP_URLS - reserved);

  const routeEntries: MetadataRoute.Sitemap = buildSeoRouteUrls("", routeLimit).map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: path.split("/").length > 3 ? 0.63 : 0.68,
  }));

  return [...staticEntries, ...cityEntries, ...routeEntries].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
