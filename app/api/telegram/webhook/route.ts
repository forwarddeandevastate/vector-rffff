import { NextResponse } from "next/server";
import {
  answerCallbackQuery,
  deleteTelegramMessage,
  editTelegramMessage,
  leadKeyboard,
  leadMessage,
  updateLeadStatusFromTelegram,
  editLeadMessagesEverywhere,
  deleteLeadMessagesEverywhere,
} from "@/lib/telegram";

export const runtime = "nodejs";

function ok() {
  // Telegram ожидает 200 OK, иначе кнопки «не прожимаются» (loading вечно).
  return NextResponse.json({ ok: true });
}

function secretHeader(req: Request) {
  return req.headers.get("x-telegram-bot-api-secret-token");
}

function isSecretAllowed(req: Request) {
  // Telegram присылает x-telegram-bot-api-secret-token только если ты задал secret_token при setWebhook.
  // На проде часто webhook ставят без secret_token → header пустой.
  // Поэтому:
  // - если TELEGRAM_WEBHOOK_SECRET НЕ задан — пропускаем.
  // - если задан, но header пустой — пропускаем (и логируем).
  // - если задан и header есть, но не совпал — блокируем.
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true;

  const got = secretHeader(req);
  if (!got) {
    console.warn(
      "TG webhook: TELEGRAM_WEBHOOK_SECRET is set but request has no secret header. Webhook likely configured without secret_token."
    );
    return true;
  }

  return got === expected;
}

export async function POST(req: Request) {
  try {
    if (!isSecretAllowed(req)) {
      // Если реально не тот секрет — блокируем.
      return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
    }

    const update = await req.json().catch(() => null);
    if (!update) return ok();

    const cq = update.callback_query;
    if (!cq) return ok();

    const callbackId = String(cq.id || "");
    const data = String(cq.data || "");

    // Всегда отвечаем на callback, чтобы Telegram не показывал «крутилку».
    if (callbackId) {
      await answerCallbackQuery(callbackId).catch(() => null);
    }

    // Тестовые кнопки из /api/admin/telegram/buttons-test
    if (data.startsWith("TEST:")) {
      return ok();
    }

    const msg = cq.message;
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    // Наша схема кнопок: L:<leadId>:<status>
    if (!chatId || !messageId || !data.startsWith("L:")) {
      return ok();
    }

    const parts = data.split(":");
    const leadId = Number(parts[1]);
    const status = String(parts[2] || "");

    if (!Number.isFinite(leadId) || !status) {
      return ok();
    }

    const updated = await updateLeadStatusFromTelegram(leadId, status);

    // ✅ отмена: удаляем из телеги (везде), но оставляем в админке (в БД) со статусом canceled
    if (status === "canceled") {
      await deleteLeadMessagesEverywhere(updated.id);
      // На всякий случай удалим и текущее сообщение (если не было сохранено в telegram_messages)
      await deleteTelegramMessage(String(chatId), Number(messageId)).catch(() => null);
      return ok();
    }

    // ✅ остальные статусы: синхронизируем всем
    const text = leadMessage(updated);
    const kb = leadKeyboard(updated.id);

    await editLeadMessagesEverywhere(updated.id, text, kb);
    // фоллбек: даже если в базе нет telegram_messages, обновим хотя бы текущее
    await editTelegramMessage(String(chatId), Number(messageId), text, kb).catch(() => null);

    return ok();
  } catch (e: any) {
    console.error("TG webhook error:", e);
    // Важно: всегда 200 OK, иначе Telegram перестаёт нормально слать callback-и.
    return ok();
  }
}