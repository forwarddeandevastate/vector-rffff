import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  answerCallbackQuery,
  deleteTelegramMessage,
  editTelegramMessage,
  leadKeyboard,
  leadMessage,
  sendTelegramText,
} from "@/lib/telegram";

export const runtime = "nodejs";

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

/**
 * Проверка секрета.
 * ВАЖНО: если TELEGRAM_WEBHOOK_SECRET задан при установке webhook —
 * он ДОЛЖЕН совпадать. Если не задан — пропускаем всё.
 */
function isValidSecret(req: Request): boolean {
  const expected = env("TELEGRAM_WEBHOOK_SECRET");

  // Секрет не задан — разрешаем всё
  if (!expected) return true;

  const got = req.headers.get("x-telegram-bot-api-secret-token") ?? "";

  // Заголовок пришёл и совпадает — отлично
  if (got && got === expected) return true;

  // Заголовок НЕ пришёл — webhook мог быть установлен без secret_token
  // Пропускаем с предупреждением (нужно переустановить webhook в настройках)
  if (!got) {
    console.warn("[tg-webhook] WARNING: TELEGRAM_WEBHOOK_SECRET задан, но заголовок не пришёл. " +
      "Вероятно webhook установлен без secret_token. Переустановите webhook в Настройках админки.");
    return true; // пропускаем чтобы кнопки работали
  }

  // Заголовок пришёл но НЕ совпадает — отклоняем
  console.error("[tg-webhook] REJECTED: secret mismatch. got=%s", got.slice(0, 8));
  return false;
}

function parseMoney(text: string): number | null {
  const digits = (text || "").replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

async function getLead(leadId: number) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true, name: true, phone: true,
      fromText: true, toText: true, datetime: true,
      carClass: true, roundTrip: true, comment: true,
      price: true, priceIsManual: true, commission: true, status: true,
    },
  });
}

// ── GET: Telegram проверяет webhook при установке ──────────────────────────
export async function GET() {
  return NextResponse.json({ ok: true });
}

// ── POST: все входящие обновления от Telegram ──────────────────────────────
export async function POST(req: Request) {

  // 1. Проверка секрета
  if (!isValidSecret(req)) {
    console.error("[tg-webhook] REJECTED: bad secret token");
    // Возвращаем 200 чтобы Telegram не повторял — но не обрабатываем
    return NextResponse.json({ ok: true });
  }

  // 2. Парсим тело
  let update: any;
  try {
    update = await req.json();
  } catch {
    console.error("[tg-webhook] Failed to parse JSON");
    return NextResponse.json({ ok: true });
  }

  if (!update || typeof update !== "object") {
    return NextResponse.json({ ok: true });
  }

  // 3. Логируем ВСЁ входящее для диагностики
  console.log("[tg-webhook] incoming:", JSON.stringify({
    update_id: update.update_id,
    type: update.callback_query ? "callback_query" : update.message ? "message" : "other",
    callback_data: update.callback_query?.data,
    message_text: update.message?.text?.slice(0, 50),
  }));

  // ── CALLBACK QUERY (нажатие кнопки) ─────────────────────────────────────
  if (update.callback_query) {
    const cq = update.callback_query;
    const cqId: string = cq.id ?? "";
    const cbData: string = cq.data ?? "";
    const tgUserId = String(cq?.from?.id ?? "");
    const chatId = String(cq?.message?.chat?.id ?? "");
    const msgId = Number(cq?.message?.message_id ?? 0);

    console.log("[tg-webhook] callback_query: data=%s chatId=%s msgId=%d", cbData, chatId, msgId);

    try {
      // Тестовая кнопка
      if (cbData === "TEST:ping") {
        if (cqId) await answerCallbackQuery(cqId, "Кнопки работают ✅");
        return NextResponse.json({ ok: true });
      }

      // Парсим формат L:{leadId}:{action}
      const m = cbData.match(/^L:(\d+):([a-z_]+)$/i);
      if (!m) {
        console.warn("[tg-webhook] Unknown callback_data: %s", cbData);
        if (cqId) await answerCallbackQuery(cqId, "Неизвестная команда");
        return NextResponse.json({ ok: true });
      }

      const leadId = Number(m[1]);
      const action = String(m[2]);

      if (!Number.isFinite(leadId) || leadId <= 0) {
        if (cqId) await answerCallbackQuery(cqId, "Некорректный ID лида");
        return NextResponse.json({ ok: true });
      }

      // ── Статусы: in_progress / done / new ───────────────────────────────
      if (["in_progress", "done", "new"].includes(action)) {
        // ВАЖНО: отвечаем на callback_query ДО тяжёлых операций
        // Иначе Vercel может таймаутить и кнопка зависнет
        if (cqId) await answerCallbackQuery(cqId, "Готово ✅").catch(() => null);

        const updateData = action === "new"
          ? { status: action, priceIsManual: false }
          : { status: action };

        await prisma.lead.update({ where: { id: leadId }, data: updateData });
        const lead = await getLead(leadId);

        if (lead) {
          const msg = leadMessage(lead);
          const kb  = leadKeyboard(lead.id);

          // Редактируем сообщение где нажали кнопку
          if (chatId && msgId) {
            await editTelegramMessage(chatId, msgId, msg, kb).catch((e: any) =>
              console.error("[tg-webhook] editMessage error:", e?.message)
            );
          }

          // Обновляем во всех чатах где есть маппинг
          const allMsgs = await prisma.telegramMessage.findMany({
            where: { kind: "lead", leadId },
            select: { chatId: true, messageId: true },
          });

          for (const mm of allMsgs) {
            if (mm.chatId === chatId && mm.messageId === msgId) continue;
            await editTelegramMessage(mm.chatId, mm.messageId, msg, kb).catch(() => null);
          }
        }

        return NextResponse.json({ ok: true });
      }

      // ── Отмена (убрать из TG) ────────────────────────────────────────────
      if (action === "canceled") {
        // Отвечаем сразу
        if (cqId) await answerCallbackQuery(cqId, "Убрано ❌").catch(() => null);

        await prisma.lead.update({
          where: { id: leadId },
          data: { status: "canceled" },
        }).catch(() => null);

        const allMsgs = await prisma.telegramMessage.findMany({
          where: { kind: "lead", leadId },
          select: { chatId: true, messageId: true },
        });

        for (const mm of allMsgs) {
          await deleteTelegramMessage(mm.chatId, mm.messageId).catch(() => null);
        }

        await prisma.telegramMessage.deleteMany({ where: { kind: "lead", leadId } });

        return NextResponse.json({ ok: true });
      }

      // ── Установить цену ──────────────────────────────────────────────────
      if (action === "set_price" || action === "set_commission") {
        if (!tgUserId || !chatId) {
          if (cqId) await answerCallbackQuery(cqId, "Нет данных чата");
          return NextResponse.json({ ok: true });
        }

        const kind = action === "set_price" ? "lead_price" : "lead_commission";
        const label = action === "set_price" ? "цену" : "комиссию";

        await prisma.pendingInput.upsert({
          where: { tgUserId },
          update: { kind, entityId: String(leadId), createdAt: new Date() },
          create: { tgUserId, kind, entityId: String(leadId) },
        });

        await sendTelegramText(
          chatId,
          `Введите ${label} для заявки <b>#${leadId}</b> (только цифры, например: 4500).`,
          { force_reply: true, input_field_placeholder: "Например: 4500", selective: false }
        );

        if (cqId) await answerCallbackQuery(cqId, `Жду ${label}...`);
        return NextResponse.json({ ok: true });
      }

      // Неизвестное действие
      console.warn("[tg-webhook] Unhandled action: %s", action);
      if (cqId) await answerCallbackQuery(cqId, "Неизвестное действие");
      return NextResponse.json({ ok: true });

    } catch (e: any) {
      console.error("[tg-webhook] callback_query error:", e?.message ?? e);
      if (cqId) {
        await answerCallbackQuery(cqId, "Ошибка сервера").catch(() => null);
      }
      return NextResponse.json({ ok: true });
    }
  }

  // ── TEXT MESSAGE (ввод суммы через force_reply) ──────────────────────────
  if (update.message) {
    const msg = update.message;
    const tgUserId = String(msg?.from?.id ?? "");
    const chatId = String(msg?.chat?.id ?? "");
    const text = String(msg?.text ?? "").trim();

    console.log("[tg-webhook] message: tgUserId=%s text=%s", tgUserId, text.slice(0, 30));

    try {
      if (!tgUserId || !chatId) return NextResponse.json({ ok: true });
      if (text.startsWith("/")) return NextResponse.json({ ok: true });

      const pending = await prisma.pendingInput.findUnique({ where: { tgUserId } });
      if (!pending) return NextResponse.json({ ok: true });

      await prisma.pendingInput.delete({ where: { tgUserId } }).catch(() => null);

      const amount = parseMoney(text);
      if (amount === null) {
        // Возвращаем ожидание
        await prisma.pendingInput.upsert({
          where: { tgUserId },
          update: { kind: pending.kind, entityId: pending.entityId, createdAt: new Date() },
          create: { tgUserId, kind: pending.kind, entityId: pending.entityId },
        });
        return NextResponse.json({ ok: true });
      }

      const leadId = Number(pending.entityId);
      if (!Number.isFinite(leadId)) return NextResponse.json({ ok: true });

      if (pending.kind === "lead_price") {
        await prisma.lead.update({ where: { id: leadId }, data: { price: amount, priceIsManual: true } });
      } else if (pending.kind === "lead_commission") {
        await prisma.lead.update({ where: { id: leadId }, data: { commission: amount } });
      }

      const lead = await getLead(leadId);
      if (lead) {
        const allMsgs = await prisma.telegramMessage.findMany({
          where: { kind: "lead", leadId },
          select: { chatId: true, messageId: true },
        });
        for (const mm of allMsgs) {
          await editTelegramMessage(mm.chatId, mm.messageId, leadMessage(lead), leadKeyboard(lead.id)).catch(() => null);
        }
      }

      // Удаляем служебные сообщения
      const userMsgId = Number(msg?.message_id ?? 0);
      const replyMsgId = Number(msg?.reply_to_message?.message_id ?? 0);
      if (userMsgId) await deleteTelegramMessage(chatId, userMsgId).catch(() => null);
      if (replyMsgId) await deleteTelegramMessage(chatId, replyMsgId).catch(() => null);

    } catch (e: any) {
      console.error("[tg-webhook] message error:", e?.message ?? e);
    }

    return NextResponse.json({ ok: true });
  }

  // Всё остальное игнорируем
  console.log("[tg-webhook] ignored update type, keys:", Object.keys(update).join(","));
  return NextResponse.json({ ok: true });
}
