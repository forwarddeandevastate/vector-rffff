import { NextResponse } from "next/server";
import { requireAdminOrThrow } from "@/lib/admin-api";
import { sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs"; // важно для стабильной работы с fetch на Vercel

export async function POST() {
  try {
    await requireAdminOrThrow();

    const chatId = process.env.TELEGRAM_CHAT_ID || "";
    if (!chatId) {
      return NextResponse.json({ ok: false, error: "Missing TELEGRAM_CHAT_ID" }, { status: 500 });
    }

    const keyboard = {
      inline_keyboard: [
        [{ text: "✅ Кнопка 1", callback_data: "TEST:1" }],
        [{ text: "✅ Кнопка 2", callback_data: "TEST:2" }],
      ],
    };

    const r = await sendTelegramText(
      chatId,
      "<b>Тест кнопок</b>\nЕсли видишь кнопки — всё ок ✅",
      keyboard
    );

    return NextResponse.json({ ok: true, result: r });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}

// чтобы GET не давал 405 “в никуда” — можно вернуть подсказку
export async function GET() {
  return NextResponse.json({ ok: true, hint: "Use POST" });
}