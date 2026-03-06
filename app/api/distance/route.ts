import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ReqBody = {
  from?: string;
  to?: string;
  fromPlaceId?: string | null;
  toPlaceId?: string | null;
};

type Coords = { lat: number; lon: number };

function okJson(data: any) {
  return NextResponse.json({ ok: true, ...data });
}
function errJson(error: string, status = 400, details?: string) {
  return NextResponse.json({ ok: false, error, ...(details ? { details } : {}) }, { status });
}

// маленький кэш в памяти (в serverless может сбрасываться — это нормально)
const geoCache = new Map<string, Coords>();

function norm(q: string) {
  return q.trim().toLowerCase();
}

async function geocodeNominatim(q: string): Promise<Coords | null> {
  const key = norm(q);
  if (!key) return null;

  const cached = geoCache.get(key);
  if (cached) return cached;

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=" +
    encodeURIComponent(q);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "vector-rf.ru distance (admin@vector-rf.ru)",
      "Accept-Language": "ru",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) return null;

  const arr = (await res.json().catch(() => null)) as any[] | null;
  if (!arr || arr.length === 0) return null;

  const lat = Number(arr[0]?.lat);
  const lon = Number(arr[0]?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const coords = { lat, lon };
  geoCache.set(key, coords);
  return coords;
}

async function routeKmSecondsOSRM(from: string, to: string) {
  const [a, b] = await Promise.all([geocodeNominatim(from), geocodeNominatim(to)]);
  if (!a || !b) return null;

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) return null;

  const data = (await res.json().catch(() => null)) as any;
  const meters = Number(data?.routes?.[0]?.distance);
  const seconds = Number(data?.routes?.[0]?.duration);
  if (!Number.isFinite(meters) || meters <= 0) return null;

  return { km: meters / 1000, seconds: Number.isFinite(seconds) ? seconds : 0 };
}

async function routeKmSecondsGoogle(body: ReqBody) {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return null;

  const origin = body.fromPlaceId
    ? { placeId: body.fromPlaceId }
    : body.from
    ? { address: body.from }
    : null;

  const destination = body.toPlaceId
    ? { placeId: body.toPlaceId }
    : body.to
    ? { address: body.to }
    : null;

  if (!origin || !destination) return null;

  const resp = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin,
      destination,
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      languageCode: "ru-RU",
      units: "METRIC",
    }),
  });

  if (!resp.ok) {
    // не фейлим жёстко — просто даём возможность fallback
    return null;
  }

  const data: any = await resp.json().catch(() => null);
  const route = data?.routes?.[0];
  const distanceMeters = Number(route?.distanceMeters ?? 0);
  const durationStr = String(route?.duration ?? "0s");
  const seconds = Number(durationStr.replace("s", "")) || 0;

  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) return null;

  return { km: distanceMeters / 1000, seconds };
}

function parseBodyFromUrl(req: Request): ReqBody {
  const { searchParams } = new URL(req.url);
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();
  const fromPlaceId = (searchParams.get("fromPlaceId") || "").trim() || null;
  const toPlaceId = (searchParams.get("toPlaceId") || "").trim() || null;
  return { from, to, fromPlaceId, toPlaceId };
}

async function handleDistance(body: ReqBody) {
  const from = (body.from ?? "").trim();
  const to = (body.to ?? "").trim();
  if (!from || !to) return errJson("Missing from/to", 400);

  // 1) Google Routes (если ключ задан)
  const g = await routeKmSecondsGoogle(body);
  if (g) {
    return okJson({ km: Math.round(g.km), seconds: g.seconds, source: "google" });
  }

  // 2) Fallback OSRM
  const o = await routeKmSecondsOSRM(from, to);
  if (!o) {
    return errJson(
      "Не удалось построить маршрут. Уточните адреса (например: 'Москва', 'Пулково (LED)' )",
      422
    );
  }

  return okJson({ km: Math.round(o.km), seconds: o.seconds, source: "osrm" });
}

export async function GET(req: Request) {
  try {
    const body = parseBodyFromUrl(req);
    return await handleDistance(body);
  } catch (e: any) {
    return errJson("server error", 500, String(e?.message ?? e));
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ReqBody;
    return await handleDistance(body);
  } catch (e: any) {
    return errJson("server error", 500, String(e?.message ?? e));
  }
}
