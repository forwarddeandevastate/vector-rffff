import { NextResponse } from "next/server";
import {
  answerCallbackQuery,
  editTelegramMessage,
  leadKeyboard,
  leadMessage,
  updateLeadStatusFromTelegram,
} from "@/lib/telegram";

function ok() {
  return NextResponse.json({ ok: true });
}

function getSecretHeader(req: Request) {
  // Telegram присылает это, если мы зададим secret_token при setWebhook
  return req.headers.get("x-telegram-bot-api-secret-token");
}

export async function POST(req: Request) {
  try {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!expected) throw new Error("Missing TELEGRAM_WEBHOOK_SECRET");

    const got = getSecretHeader(req);
    if (got !== expected) {
      return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
    }

    const update = await req.json().catch(() => null);
    if (!update) return ok();

    // нас интересует callback_query от кнопок
    const cq = update.callback_query;
    if (!cq) return ok();

    const callbackId = cq.id as string;
    const data = String(cq.data || ""); // "L:<id>:<status>"
    const msg = cq.message;
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    if (!data.startsWith("L:") || !chatId || !messageId) {
      await answerCallbackQuery(callbackId, "Не распознано");
      return ok();
    }

    const parts = data.split(":");
    const leadId = Number(parts[1]);
    const status = parts[2];

    if (!Number.isFinite(leadId) || !status) {
      await answerCallbackQuery(callbackId, "Неверные данные");
      return ok();
    }

    // обновляем лид
    const updated = await updateLeadStatusFromTelegram(leadId, status);

    // обновляем сообщение в чате (перерисовываем текст и кнопки)
    await editTelegramMessage(
      String(chatId),
      Number(messageId),
      leadMessage(updated),
      leadKeyboard(updated.id)
    );

    await answerCallbackQuery(callbackId, "Готово ✅");
    return ok();
  } catch (e: any) {
    console.error("TG webhook error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
