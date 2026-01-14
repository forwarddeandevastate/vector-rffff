import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tgSendLead } from "@/lib/telegram";

function normPhone(s: string) {
  return (s || "").replace(/[^\d+]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = String(body.name || "").trim();
    const phone = normPhone(String(body.phone || ""));
    const fromText = String(body.fromText || "").trim();
    const toText = String(body.toText || "").trim();

    const pickupAddress = body.pickupAddress ? String(body.pickupAddress).trim() : null;
    const dropoffAddress = body.dropoffAddress ? String(body.dropoffAddress).trim() : null;
    const datetime = body.datetime ? String(body.datetime).trim() : null;

    const carClass = String(body.carClass || "standard").trim();
    const roundTrip = Boolean(body.roundTrip);

    const price =
      body.price === null || body.price === undefined || body.price === ""
        ? null
        : Number(body.price);

    const comment = body.comment ? String(body.comment).trim() : null;

    const utmSource = body.utmSource ? String(body.utmSource).trim() : null;
    const utmMedium = body.utmMedium ? String(body.utmMedium).trim() : null;
    const utmCampaign = body.utmCampaign ? String(body.utmCampaign).trim() : null;

    // обязательные поля под твою schema.prisma
    if (!name || !phone || !fromText || !toText) {
      return NextResponse.json(
        { ok: false, error: "name, phone, fromText, toText required" },
        { status: 400 }
      );
    }

    // ---- антидубликат: 24 часа по (phone + fromText + toText + datetime?) ----
    const WINDOW_HOURS = 24;
    const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);

    const existing = await prisma.lead.findFirst({
      where: {
        phone,
        fromText,
        toText,
        createdAt: { gte: since },
        ...(datetime ? { datetime } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        fromText,
        toText,
        pickupAddress,
        dropoffAddress,
        datetime,
        carClass,
        roundTrip,
        price: Number.isFinite(price as number) ? (price as number) : null,
        comment,
        status: "new",
        isDuplicate: !!existing,
        duplicateOfId: existing?.id ?? null,
        utmSource,
        utmMedium,
        utmCampaign,
      },
      select: {
        id: true,
        status: true,
        isDuplicate: true,
        duplicateOfId: true,
        createdAt: true,
      },
    });

    // ---- Telegram уведомление (если env заданы) ----
    await tgSendLead({
  id: lead.id,
  name,
  phone,
  route: `${fromText} → ${toText}`,
  datetime,
  comment,
  isDuplicate: lead.isDuplicate,
});

    return NextResponse.json({ ok: true, lead });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "server error" },
      { status: 500 }
    );
  }
}
