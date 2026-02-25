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
  // Telegram должен получать 200 OK, иначе кнопки “висят” и не прожимаются
  return NextResponse.json({ ok: true });
}

function secretHeader(req: Request) {
  return req.headers.get("x-telegram-bot-api-secret-token");
}

function isAllowedBySecret(req: Request) {
  /**
   * Telegram присылает x-telegram-bot-api-secret-token ТОЛЬКО если webhook был установлен с secret_token.
   * Часто webhook ставят без secret_token → заголовка нет.
   *
   * Политика:
   * - Если TELEGRAM_WEBHOOK_SECRET НЕ задан → пропускаем.
   * - Если задан, но заголовка НЕТ → пропускаем (и логируем), иначе кнопки не будут работать.
   * - Если задан и заголовок ЕСТЬ, но не совпал → блокируем.
   */
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!expected) return true;

  const got = secretHeader(req);
  if (!got) {
    console.warn(
      "TG webhook: TELEGRAM_WEBHOOK_SECRET is set, but request has no secret header. Webhook likely set without secret_token."
    );
    return true;
  }

  return got === expected;
}

export async function POST(req: Request) {
  try {
    if (!isAllowedBySecret(req)) {
      // Если реально пришёл неправильный secret — блокируем
      return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
    }

    const update = await req.json().catch(() => null);
    if (!update) return ok();

    const cq = update.callback_query;
    if (!cq) return ok();

    const callbackId = String(cq.id || "");
    const data = String(cq.data || "");

    // Всегда отвечаем на callback, чтобы Telegram не крутил “loading”
    if (callbackId) {
      await answerCallbackQuery(callbackId).catch(() => null);
    }

    const msg = cq.message;
    const chatId = msg?.chat?.id;
    const messageId = msg?.message_id;

    // Схема кнопок: L:<leadId>:<status>
    if (!chatId || !messageId || !data.startsWith("L:")) return ok();

    const parts = data.split(":");
    const leadId = Number(parts[1]);
    const status = String(parts[2] || "");

    if (!Number.isFinite(leadId) || !status) return ok();

    const updated = await updateLeadStatusFromTelegram(leadId, status);

    // ✅ Отмена: удаляем из телеги (во всех чатах), но в админке остаётся (в БД статус canceled)
    if (status === "canceled") {
      await deleteLeadMessagesEverywhere(updated.id);
      // фоллбек: если конкретно это сообщение не было сохранено в БД
      await deleteTelegramMessage(String(chatId), Number(messageId)).catch(() => null);
      return ok();
    }

    // ✅ Остальные статусы: редактируем всем, кто видел заявку
    const text = leadMessage(updated);
    const kb = leadKeyboard(updated.id);

    await editLeadMessagesEverywhere(updated.id, text, kb);
    // фоллбек: обновим текущее сообщение, даже если в БД нет связки
    await editTelegramMessage(String(chatId), Number(messageId), text, kb).catch(() => null);

    return ok();
  } catch (e: any) {
    console.error("TG webhook error:", e);
    // Важно: всегда 200 OK, иначе Telegram перестаёт нормально слать callback-и
    return ok();
  }
}

// Удобная проверка, что endpoint жив на проде
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/telegram/webhook" });
}