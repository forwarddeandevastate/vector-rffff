import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.review.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, rating: true, text: true, city: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, reviews: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = String(body.name || "").trim();
    const text = String(body.text || "").trim();
    const city = body.city ? String(body.city).trim() : null;

    const ratingNum = Number(body.rating);
    const rating = Number.isFinite(ratingNum) ? Math.min(5, Math.max(1, Math.round(ratingNum))) : 5;

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 400 });
    }
    if (!text || text.length < 10) {
      return NextResponse.json({ ok: false, error: "Отзыв слишком короткий" }, { status: 400 });
    }

    // создаём как НЕ публичный — ждёт модерации
    const created = await prisma.review.create({
      data: {
        name,
        rating,
        text,
        city,
        source: "site",
        isPublic: false,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
