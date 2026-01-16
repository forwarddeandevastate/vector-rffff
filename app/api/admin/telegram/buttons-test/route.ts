import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { sendTelegramText, leadKeyboard } from "@/lib/telegram";

export async function POST() {
  try {
    await requireAdmin();

    const chatId = process.env.TELEGRAM_CHAT_ID || "";
    if (!chatId) {
      return NextResponse.json({ ok: false, error: "Missing TELEGRAM_CHAT_ID" }, { status: 500 });
    }

    const r = await sendTelegramText(
      chatId,
      "<b>Тест кнопок</b>\nЕсли кнопки видны — всё ок ✅",
      leadKeyboard(99999)
    );

    return NextResponse.json({ ok: true, result: r });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
