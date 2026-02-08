import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// ✅ ОТКЛЮЧАЕМ КЭШ ДЛЯ GET (иначе Vercel/Next может отдавать старый JSON)
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🛡 honeypot (если заполнено — молча ok)
function isHoneypotFilled(body: any) {
  return String(body?.company || "").trim().length > 0;
}

/**
 * rating может прилетать как:
 *  - число: 5
 *  - строка: "5", "5/5", "★★★★★ (5)", "rating: 4"
 *  - пусто/мусор -> null
 */
function parseRating(value: any): number | null {
  if (value === undefined || value === null || value === "") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.min(5, Math.trunc(value)));
  }

  const s = String(value).trim();

  // Берём первую цифру 1..5 из строки
  const m = s.match(/([1-5])/);
  if (!m) return null;

  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;

  return Math.max(1, Math.min(5, Math.trunc(n)));
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

    // ✅ гарантируем number для рейтинга (если в базе null — считаем 5)
    const normalized = rows.map((r) => ({
      ...r,
      rating: Number.isFinite(Number(r.rating)) ? Math.max(1, Math.min(5, Number(r.rating))) : 5,
    }));

    const res = NextResponse.json({ ok: true, reviews: normalized });

    // ✅ железобетонно запрещаем кэш на CDN/браузере
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");

    return res;
  } catch (e) {
    console.error("REVIEWS GET ERROR:", e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    if (isHoneypotFilled(body)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const name = String(body?.name || "").trim();
    const text = String(body?.text || "").trim();
    const city = body?.city ? String(body.city).trim() : null;

    // ✅ надёжный парсер рейтинга
    const rating = parseRating(body?.rating) ?? 5;

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 400 });
    }
    if (!text || text.length < 10) {
      return NextResponse.json({ ok: false, error: "Отзыв слишком короткий" }, { status: 400 });
    }
    if (name.length > 60 || text.length > 2000) {
      return NextResponse.json({ ok: false, error: "Слишком длинный текст" }, { status: 400 });
    }

    // ✅ ТВОЁ УСЛОВИЕ: модерация только если рейтинг < 3
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

    return NextResponse.json({ ok: true, id: created.id, isPublic: created.isPublic });
  } catch (e: any) {
    console.error("REVIEWS POST ERROR:", e);
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}