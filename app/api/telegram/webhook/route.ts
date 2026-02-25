import { NextResponse } from "next/server";
import {
  answerCallbackQuery,
  editTelegramMessage,
  leadKeyboard,
  leadMessage,
  updateLeadStatusFromTelegram,
  editLeadMessagesEverywhere,
  deleteLeadMessagesEverywhere,
} from "@/lib/telegram";

export const runtime = "nodejs";

function ok() {
  return NextResponse.json({ ok: true });
}

function secretHeader(req: Request) {
  return req.headers.get("x-telegram-bot-api-secret-token");
}

export async function POST(req: Request) {
  try {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!expected) throw new Error("Missing TELEGRAM_WEBHOOK_SECRET");

    const got = secretHeader(req);
    if (got !== expected) {
      return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
    }

    const update = await req.json().catch(() => null);
    if (!update) return ok();

    const cq = update.callback_query;
    if (!cq) return ok();

    const callbackId = String(cq.id || "");
    const data = String(cq.data || "");
    const msg = cq.message;

    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    if (!callbackId || !chatId || !messageId || !data.startsWith("L:")) {
      if (callbackId) await answerCallbackQuery(callbackId, "Не распознано");
      return ok();
    }

    const parts = data.split(":"); // L:<leadId>:<status>
    const leadId = Number(parts[1]);
    const status = parts[2];

    if (!Number.isFinite(leadId) || !status) {
      await answerCallbackQuery(callbackId, "Неверные данные");
      return ok();
    }

    const updated = await updateLeadStatusFromTelegram(leadId, status);

    // ✅ Если отменили — удаляем во всех чатах (пропадает из телеги), но в админке остаётся со статусом canceled
    if (status === "canceled") {
      await deleteLeadMessagesEverywhere(updated.id);
      // на всякий случай попробуем удалить и текущую (если она не была в базе)
      // (ошибки игнорим)
      await (async () => {
        // delete через editTelegramMessage не получится, поэтому просто не трогаем тут
      })();

      await answerCallbackQuery(callbackId, "Отменено ✅");
      return ok();
    }

    // ✅ В остальных статусах — обновляем ВСЕ сообщения во всех чатах
    await editLeadMessagesEverywhere(updated.id, leadMessage(updated), leadKeyboard(updated.id));

    // Фоллбек: если по какой-то причине нет записей в telegram_messages, обновим хотя бы текущую
    await editTelegramMessage(String(chatId), Number(messageId), leadMessage(updated), leadKeyboard(updated.id)).catch(
      () => null
    );

    await answerCallbackQuery(callbackId, "Готово ✅");
    return ok();
  } catch (e: any) {
    console.error("TG webhook error:", e);
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}