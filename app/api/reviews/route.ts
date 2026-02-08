// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // важно: не даём Next/Vercel кэшировать

// 🛡 honeypot (если заполнено — молча ok)
function isHoneypotFilled(body: any) {
  return String(body?.company || "").trim().length > 0;
}

function clampInt(n: any, min: number, max: number) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return Math.max(min, Math.min(max, Math.trunc(x)));
}

function jsonNoStore(data: any, init?: { status?: number }) {
  const res = NextResponse.json(data, { status: init?.status ?? 200 });
  // жестко запрещаем кэш на CDN/браузере
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

export async function GET() {
  try {
    const rows = await prisma.review.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        rating: true,
        text: true,
        city: true,
        createdAt: true,
      },
    });

    // ✅ рейтинг всегда number 1..5 (если null — считаем 5)
    const normalized = rows.map((r) => ({
      ...r,
      rating: Number.isFinite(Number(r.rating)) ? Math.max(1, Math.min(5, Number(r.rating))) : 5,
    }));

    return jsonNoStore({ ok: true, reviews: normalized });
  } catch (e) {
    console.error("REVIEWS GET ERROR:", e);
    return jsonNoStore({ ok: false, error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 🛡 honeypot
    if (isHoneypotFilled(body)) {
      return jsonNoStore({ ok: true, ignored: true });
    }

    const name = String(body?.name || "").trim();
    const text = String(body?.text || "").trim();
    const city = body?.city ? String(body.city).trim() : null;

    // rating:
    // - если не передали/мусор -> 5
    // - иначе clamp 1..5
    const ratingRaw =
      body?.rating === undefined || body?.rating === null || body?.rating === ""
        ? null
        : clampInt(body?.rating, 1, 5);
    const rating = ratingRaw ?? 5;

    if (!name || name.length < 2) {
      return jsonNoStore({ ok: false, error: "Введите имя" }, { status: 400 });
    }
    if (!text || text.length < 10) {
      return jsonNoStore({ ok: false, error: "Отзыв слишком короткий" }, { status: 400 });
    }
    if (name.length > 60 || text.length > 2000) {
      return jsonNoStore({ ok: false, error: "Слишком длинный текст" }, { status: 400 });
    }

    // ✅ правило: <3 звезды -> модерация (isPublic=false), >=3 -> публикуем сразу
    const isPublic = rating >= 3;

    const created = await prisma.review.create({
      data: {
        name,
        rating,
        text,
        city,
        source: "site",
        isPublic,
      },
      select: { id: true, isPublic: true },
    });

    return jsonNoStore({ ok: true, id: created.id, isPublic: created.isPublic });
  } catch (e: any) {
    console.error("REVIEWS POST ERROR:", e);
    return jsonNoStore({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}