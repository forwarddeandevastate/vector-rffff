import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Coords = { lat: number; lon: number };

function okJson(data: any) {
  return NextResponse.json({ ok: true, ...data });
}
function errJson(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

// маленький кэш в памяти (в serverless может сбрасываться — это нормально)
const geoCache = new Map<string, Coords>();

function norm(q: string) {
  return q.trim().toLowerCase();
}

async function geocode(q: string): Promise<Coords | null> {
  const key = norm(q);
  if (!key) return null;

  const cached = geoCache.get(key);
  if (cached) return cached;

  // Nominatim требует User-Agent
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&q=" +
    encodeURIComponent(q);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "vector-rf.ru distance (admin@vector-rf.ru)",
      "Accept-Language": "ru",
    },
    // лёгкий кэш на стороне Next (можно убрать, но так меньше запросов)
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

async function routeKm(a: Coords, b: Coords): Promise<number | null> {
  // OSRM public router: distance in meters
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) return null;

  const data = (await res.json().catch(() => null)) as any;
  const meters = data?.routes?.[0]?.distance;
  if (!Number.isFinite(meters)) return null;

  return meters / 1000;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = (searchParams.get("from") || "").trim();
    const to = (searchParams.get("to") || "").trim();

    if (!from || !to) return errJson("Missing from/to", 400);

    const [a, b] = await Promise.all([geocode(from), geocode(to)]);
    if (!a || !b) {
      return errJson(
        "Не удалось определить координаты. Уточните названия (например: 'Москва', 'Пулково (LED)')",
        422
      );
    }

    const km = await routeKm(a, b);
    if (km == null) return errJson("Не удалось построить маршрут", 502);

    // округлим до целых км (как было у тебя)
    const kmRounded = Math.round(km);
    return okJson({ km: kmRounded });
  } catch (e: any) {
    return errJson(e?.message || "server error", 500);
  }
}
