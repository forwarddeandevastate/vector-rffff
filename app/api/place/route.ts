import { NextResponse } from "next/server";

export const runtime = "nodejs";

function okJson(data: any) {
  return NextResponse.json({ ok: true, ...data });
}
function errJson(error: string, status = 400, details?: string) {
  return NextResponse.json({ ok: false, error, ...(details ? { details } : {}) }, { status });
}

type PlaceMeta = {
  placeId: string;
  name?: string;
  formattedAddress?: string;
  types: string[];
  city?: string | null;
  admin1?: string | null;
  country?: string | null;
};

// лёгкий in-memory cache (serverless может сбрасываться — ок)
const cache = new Map<string, { exp: number; value: PlaceMeta }>();
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 дней

function pickComponent(components: any[], type: string) {
  return components?.find((c) => Array.isArray(c?.types) && c.types.includes(type)) || null;
}

function normalizeCityKey(s?: string | null) {
  const v = (s ?? "").trim().toLowerCase();
  if (!v) return null;
  return v
    .replace(/ё/g, "е")
    .replace(/[\u2011\u2012\u2013\u2014\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPlaceDetails(placeId: string, key: string): Promise<PlaceMeta | null> {
  // Places Details API
  const url =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent("types,address_component,name,formatted_address")}` +
    `&language=ru&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) return null;

  const data: any = await res.json().catch(() => null);
  const result = data?.result;
  if (!result) return null;

  const components = result?.address_components || [];

  const locality = pickComponent(components, "locality")?.long_name || null;
  const admin2 = pickComponent(components, "administrative_area_level_2")?.long_name || null;
  const admin1 = pickComponent(components, "administrative_area_level_1")?.long_name || null;
  const country = pickComponent(components, "country")?.long_name || null;

  const city = normalizeCityKey(locality || admin2 || admin1);

  return {
    placeId,
    name: result?.name || undefined,
    formattedAddress: result?.formatted_address || undefined,
    types: Array.isArray(result?.types) ? result.types : [],
    city,
    admin1: normalizeCityKey(admin1),
    country: normalizeCityKey(country),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = (searchParams.get("placeId") || "").trim();
    if (!placeId) return errJson("Missing placeId", 400);

    const key = process.env.GOOGLE_MAPS_SERVER_KEY;
    if (!key) return errJson("Missing GOOGLE_MAPS_SERVER_KEY", 500);

    const cached = cache.get(placeId);
    const now = Date.now();
    if (cached && cached.exp > now) {
      return okJson({ ...cached.value, source: "cache" });
    }

    const meta = await fetchPlaceDetails(placeId, key);
    if (!meta) return errJson("Place not found", 404);

    cache.set(placeId, { exp: now + TTL_MS, value: meta });
    return okJson({ ...meta, source: "google" });
  } catch (e: any) {
    return errJson("server error", 500, String(e?.message ?? e));
  }
}
