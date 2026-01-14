import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normPhone(phone: string) {
  return (phone || "").replace(/[^\d]/g, "");
}
function normText(s: string) {
  return (s || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const fromText = typeof body.fromText === "string" ? body.fromText.trim() : "";
    const toText = typeof body.toText === "string" ? body.toText.trim() : "";
    const carClass = typeof body.carClass === "string" ? body.carClass.trim() : "standard";

    if (!name || !phone || !fromText || !toText) {
      return NextResponse.json({ ok: false, error: "Заполни обязательные поля" }, { status: 400 });
    }

    // ===== антидубликаты =====
    // правило: если за последние 2 часа уже есть такой же телефон + маршрут (from/to) -> считаем дубликатом
    const phoneN = normPhone(phone);
    const fromN = normText(fromText);
    const toN = normText(toText);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const possibleDup = await prisma.lead.findFirst({
      where: {
        createdAt: { gte: twoHoursAgo },
        // грубо: сравнение по нормализованным значениям делаем в коде ниже
      },
      orderBy: { id: "desc" },
      select: { id: true, phone: true, fromText: true, toText: true },
    });

    let isDuplicate = false;
    let duplicateOfId: number | null = null;

    // Чтобы не делать дорогие запросы без индексов, берем последних N лидов и проверяем в JS
    // (для старта проекта — норм; позже оптимизируем)
    const recent = await prisma.lead.findMany({
      where: { createdAt: { gte: twoHoursAgo } },
      orderBy: { id: "desc" },
      take: 200,
      select: { id: true, phone: true, fromText: true, toText: true },
    });

    const found = recent.find((x) => {
      return normPhone(x.phone) === phoneN && normText(x.fromText) === fromN && normText(x.toText) === toN;
    });

    if (found) {
      isDuplicate = true;
      duplicateOfId = found.id;
    }

    const created = await prisma.lead.create({
      data: {
        name,
        phone,
        fromText,
        toText,

        pickupAddress: typeof body.pickupAddress === "string" ? body.pickupAddress.trim() : null,
        dropoffAddress: typeof body.dropoffAddress === "string" ? body.dropoffAddress.trim() : null,
        datetime: typeof body.datetime === "string" ? body.datetime.trim() : null,

        carClass,
        roundTrip: Boolean(body.roundTrip),
        price: typeof body.price === "number" ? body.price : null,

        comment: typeof body.comment === "string" ? body.comment.trim() : null,

        isDuplicate,
        duplicateOfId,

        utmSource: typeof body.utmSource === "string" ? body.utmSource.trim() : null,
        utmMedium: typeof body.utmMedium === "string" ? body.utmMedium.trim() : null,
        utmCampaign: typeof body.utmCampaign === "string" ? body.utmCampaign.trim() : null,
      },
      select: {
        id: true,
        isDuplicate: true,
        duplicateOfId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, lead: created });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
