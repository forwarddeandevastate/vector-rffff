import type { MetadataRoute } from "next";

import { CITY_LANDINGS } from "@/lib/city-landings";
import { absoluteUrl } from "@/lib/seo";

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
  "/mezhdugorodnee-taksi",
  "/transfer-v-aeroport",
  "/transfer-iz-aeroporta",
] as const;

const STATIC_PRIORITIES: Partial<Record<(typeof STATIC_PATHS)[number], number>> = {
  "/": 1,
  "/services": 0.95,
  "/intercity-taxi": 0.95,
  "/airport-transfer": 0.9,
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
  "/taxi-mezhgorod": 0.92,
  "/mezhdugorodnee-taksi": 0.92,
  "/transfer-v-aeroport": 0.9,
  "/transfer-iz-aeroporta": 0.9,
};

const STATIC_CHANGE_FREQUENCY: Partial<
  Record<(typeof STATIC_PATHS)[number], MetadataRoute.Sitemap[number]["changeFrequency"]>
> = {
  "/": "weekly",
  "/services": "weekly",
  "/intercity-taxi": "weekly",
  "/airport-transfer": "weekly",
  "/city": "weekly",
  "/city-transfer": "weekly",
  "/minivan-transfer": "weekly",
  "/corporate-taxi": "weekly",
  "/corporate": "monthly",
  "/about": "monthly",
  "/contacts": "monthly",
  "/reviews": "weekly",
  "/faq": "monthly",
  "/prices": "monthly",
  "/requisites": "yearly",
  "/privacy": "yearly",
  "/personal-data": "yearly",
  "/agreement": "yearly",
  "/taxi-mezhgorod": "weekly",
  "/mezhdugorodnee-taksi": "weekly",
  "/transfer-v-aeroport": "weekly",
  "/transfer-iz-aeroporta": "weekly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const seen = new Set<string>();

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS.map((path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: STATIC_CHANGE_FREQUENCY[path] ?? "monthly",
      priority: STATIC_PRIORITIES[path] ?? 0.5,
    })),
    ...CITY_LANDINGS.map((city) => ({
      url: absoluteUrl(`/${city.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...CITY_LANDINGS.flatMap((city) =>
      city.popularTo.slice(0, 10).map((to) => ({
        url: absoluteUrl(`/${city.slug}/${to}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      }))
    ),
  ];

  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
