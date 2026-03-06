import { NextResponse } from "next/server";

type Coords = { lat: number; lon: number };

function okJson(data: any) {
  return NextResponse.json({ ok: true, ...data }, { status: 200 });
}

function errJson(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function geocode(q: string): Promise<Coords | null> {
  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q,
      format: "json",
      limit: "1",
    });

  const res = await fetch(url, {
    headers: {
      "User-Agent": "vector-rf.ru (distance calc)",
      "Accept-Language": "ru",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as any;
  const item = Array.isArray(data) ? data[0] : null;
  if (!item?.lat || !item?.lon) return null;

  return { lat: Number(item.lat), lon: Number(item.lon) };
}

async function routeInfo(
  a: Coords,
  b: Coords
): Promise<{ km: number; minutes: number } | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json().catch(() => null)) as any;
  const route = data?.routes?.[0];
  const meters = route?.distance;
  const seconds = route?.duration;

  if (!Number.isFinite(meters) || !Number.isFinite(seconds)) return null;

  const km = meters / 1000;
  const minutes = Math.max(1, Math.round(seconds / 60));
  return { km, minutes };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as any;
    const from = String(body?.from || "").trim();
    const to = String(body?.to || "").trim();

    if (!from || !to) return errJson("Укажите «Откуда» и «Куда»", 400);

    const [a, b] = await Promise.all([geocode(from), geocode(to)]);
    if (!a || !b) return errJson("Не удалось определить координаты", 502);

    const info = await routeInfo(a, b);
    if (!info) return errJson("Не удалось построить маршрут", 502);

    return okJson({
      km: Math.round(info.km),
      minutes: info.minutes,
    });
  } catch (e: any) {
    return errJson(e?.message || "server error", 500);
  }
}