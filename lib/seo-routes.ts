import { CITY_LANDINGS } from "@/lib/city-landings";

export type SeoRoute = { from: string; to: string };

const PRIORITY_SOURCE_SLUGS = [
  "moskva",
  "sankt-peterburg",
  "nizhniy-novgorod",
  "kazan",
  "yekaterinburg",
  "samara",
  "ufa",
  "chelyabinsk",
  "novosibirsk",
  "krasnoyarsk",
  "rostov-na-donu",
  "krasnodar",
  "sochi",
  "simferopol",
  "stavropol",
  "voronezh",
  "volgograd",
  "saratov",
  "tyumen",
  "perm",
] as const;

const PRIORITY_PAIR_SLUGS: Array<[string, string]> = [
  ["moskva", "sankt-peterburg"],
  ["moskva", "nizhniy-novgorod"],
  ["moskva", "kazan"],
  ["moskva", "yekaterinburg"],
  ["moskva", "samara"],
  ["moskva", "rostov-na-donu"],
  ["moskva", "krasnodar"],
  ["moskva", "sochi"],
  ["moskva", "simferopol"],
  ["sankt-peterburg", "moskva"],
  ["nizhniy-novgorod", "moskva"],
  ["kazan", "moskva"],
  ["yekaterinburg", "tyumen"],
  ["rostov-na-donu", "krasnodar"],
  ["rostov-na-donu", "sochi"],
  ["krasnodar", "sochi"],
  ["krasnodar", "anapa"],
  ["krasnodar", "novorossiysk"],
  ["samara", "moskva"],
  ["ufa", "chelyabinsk"],
] as const;

// Оставляем только коммерчески осмысленные и реально существующие кластеры.
// Убираем /route/* из sitemap: это legacy-путь с редиректом, а не индексируемый кластер.
export const SEO_ROUTE_VARIANT_PREFIXES = [
  null,
  "transfer",
  "taxi-mezhgorod",
  "mezhdugorodnee-taksi",
  "taksi-iz",
  "taksi-v",
] as const;

export type SeoRouteVariantPrefix = (typeof SEO_ROUTE_VARIANT_PREFIXES)[number];

const VALID_CITY_SLUGS = CITY_LANDINGS.map((city) => city.slug);
const VALID_CITY_SET = new Set(VALID_CITY_SLUGS);

function isValidSlug(slug: string) {
  return VALID_CITY_SET.has(slug);
}

export function buildSeoRoutes(limit = 50000): SeoRoute[] {
  const out: SeoRoute[] = [];
  const seen = new Set<string>();

  const push = (from: string, to: string) => {
    if (!isValidSlug(from) || !isValidSlug(to) || from === to) return;
    const key = `${from}__${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ from, to });
  };

  for (const [from, to] of PRIORITY_PAIR_SLUGS) {
    push(from, to);
    if (out.length >= limit) return out;
  }

  const prioritySources = PRIORITY_SOURCE_SLUGS.filter(isValidSlug);
  for (const from of prioritySources) {
    for (const to of VALID_CITY_SLUGS) {
      push(from, to);
      if (out.length >= limit) return out;
    }
  }

  for (const from of VALID_CITY_SLUGS) {
    for (const to of VALID_CITY_SLUGS) {
      push(from, to);
      if (out.length >= limit) return out;
    }
  }

  return out.slice(0, limit);
}

export function buildSeoRouteUrls(basePath = "", limit = 50000): string[] {
  const routesPerVariant = Math.ceil(limit / SEO_ROUTE_VARIANT_PREFIXES.length);
  const routes = buildSeoRoutes(routesPerVariant);
  const urls: string[] = [];
  const seen = new Set<string>();

  for (const prefix of SEO_ROUTE_VARIANT_PREFIXES) {
    for (const route of routes) {
      const path = prefix
        ? `${basePath}/${prefix}/${route.from}/${route.to}`
        : `${basePath}/${route.from}/${route.to}`;

      const normalized = path || "/";
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      urls.push(normalized);
      if (urls.length >= limit) return urls;
    }
  }

  return urls;
}
