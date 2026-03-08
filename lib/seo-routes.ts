import { CITY_LANDINGS } from "@/lib/city-landings";
import type { RouteVariantKey } from "@/lib/route-variants";

export type SeoRoute = { from: string; to: string };

export const PRIORITY_SOURCE_SLUGS = [
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

export const PRIORITY_PAIR_SLUGS: Array<[string, string]> = [
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
const PRIORITY_SOURCE_SET = new Set<string>(PRIORITY_SOURCE_SLUGS.filter((slug) => VALID_CITY_SET.has(slug)));
const PRIORITY_PAIR_SET = new Set<string>(
  PRIORITY_PAIR_SLUGS.filter(([from, to]) => VALID_CITY_SET.has(from) && VALID_CITY_SET.has(to)).map(
    ([from, to]) => `${from}__${to}`
  )
);

function isValidSlug(slug: string) {
  return VALID_CITY_SET.has(slug);
}

function isPriorityPair(from: string, to: string) {
  return PRIORITY_PAIR_SET.has(`${from}__${to}`);
}

function touchesPriorityHub(from: string, to: string) {
  return PRIORITY_SOURCE_SET.has(from) || PRIORITY_SOURCE_SET.has(to);
}

export function isRouteVariantIndexable(variantKey: RouteVariantKey, from: string, to: string) {
  if (!isValidSlug(from) || !isValidSlug(to) || from === to) return false;

  if (variantKey === "route") return false;
  if (variantKey === "main" || variantKey === "transfer") return true;

  const priorityPair = isPriorityPair(from, to);
  const priorityHub = touchesPriorityHub(from, to);

  if (variantKey === "taxi-mezhgorod" || variantKey === "mezhdugorodnee-taksi") {
    return priorityPair || priorityHub;
  }

  if (variantKey === "taksi-iz") {
    return priorityPair || PRIORITY_SOURCE_SET.has(from);
  }

  if (variantKey === "taksi-v") {
    return priorityPair || PRIORITY_SOURCE_SET.has(to);
  }

  return false;
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
  const routes = buildSeoRoutes(limit);
  const urls: string[] = [];
  const seen = new Set<string>();

  const pushUrl = (path: string) => {
    const normalized = path || "/";
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    urls.push(normalized);
    return urls.length < limit;
  };

  const buildPath = (prefix: SeoRouteVariantPrefix, from: string, to: string) =>
    prefix ? `${basePath}/${prefix}/${from}/${to}` : `${basePath}/${from}/${to}`;

  // Сначала всегда добавляем основной кластер и transfer по всем маршрутам.
  // Это даёт самое чистое покрытие под «такси» и «трансфер» без избыточных дублей.
  for (const variant of [null, "transfer"] as const) {
    for (const route of routes) {
      if (!pushUrl(buildPath(variant, route.from, route.to))) return urls;
    }
  }

  // Дополнительные SEO-кластеры индексируем только по коммерчески приоритетным маршрутам.
  for (const variant of ["taxi-mezhgorod", "mezhdugorodnee-taksi", "taksi-iz", "taksi-v"] as const) {
    for (const route of routes) {
      if (!isRouteVariantIndexable(variant, route.from, route.to)) continue;
      if (!pushUrl(buildPath(variant, route.from, route.to))) return urls;
    }
  }

  return urls;
}
