import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadKeyboard, leadMessage, sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const fromText = String(body.fromText || body.from || "").trim();
    const toText = String(body.toText || body.to || "").trim();
    const carClass = String(body.carClass || "standard").trim();
    const roundTrip = Boolean(body.roundTrip);
    const datetime = body.datetime ? String(body.datetime).trim() : null;
    const comment = body.comment ? String(body.comment).trim() : null;

    const price =
      body.price === null || body.price === undefined
        ? null
        : Number.isFinite(Number(body.price))
        ? Math.round(Number(body.price))
        : null;

    if (!name || name.length < 2) return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 400 });
    if (!phone || phone.length < 6) return NextResponse.json({ ok: false, error: "Введите телефон" }, { status: 400 });
    if (!fromText) return NextResponse.json({ ok: false, error: "Укажите откуда" }, { status: 400 });
    if (!toText) return NextResponse.json({ ok: false, error: "Укажите куда" }, { status: 400 });

    const lead = await prisma.lead.create({
      data: { name, phone, fromText, toText, datetime, carClass, roundTrip, price, comment, status: "new" },
      select: {
        id: true,
        name: true,
        phone: true,
        fromText: true,
        toText: true,
        datetime: true,
        carClass: true,
        roundTrip: true,
        comment: true,
        price: true,
        status: true,
      },
    });

    const chatId = process.env.TELEGRAM_CHAT_ID || "";
    const enabled = process.env.TELEGRAM_ENABLED;
    let telegramOk = false;

    if (chatId) {
      const tg = await sendTelegramText(chatId, leadMessage(lead), leadKeyboard(lead.id));
      telegramOk = !!tg?.ok;
    }

    return NextResponse.json({
      ok: true,
      version: "leads_v2_buttons_await",
      leadId: lead.id,
      telegramOk,
      env: { hasChatId: !!chatId, enabled },
    });
  } catch (e: any) {
    console.error("LEADS API ERROR:", e);
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
