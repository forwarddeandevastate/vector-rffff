import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  answerCallbackQuery,
  editLeadMessagesEverywhere,
  leadKeyboard,
  leadMessage,
  sendTelegramText,
  deleteLeadMessagesEverywhere as deleteLeadTgMessagesEverywhere,
  updateLeadStatusFromTelegram,
} from "@/lib/telegram";

export const runtime = "nodejs";

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

function isValidSecret(req: Request) {
  const expected = env("TELEGRAM_WEBHOOK_SECRET");
  // если секрет не задан — принимаем (но лучше задать в проде)
  if (!expected) return true;
  const got = req.headers.get("x-telegram-bot-api-secret-token");
  return !!got && got === expected;
}

function parseMoney(text: string): number | null {
  // допускаем: "25440", "25 440", "25,440", "25.440"
  const digits = (text || "").replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;
  if (n < 0) return null;
  return Math.round(n);
}

async function fetchLeadForMessage(leadId: number) {
  return prisma.lead.findUnique({
    where: { id: leadId },
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
      commission: true,
      status: true,
    },
  });
}

async function handleLeadStatus(leadId: number, status: string) {
  const updated = await updateLeadStatusFromTelegram(leadId, status);
  await editLeadMessagesEverywhere(updated.id, leadMessage(updated), leadKeyboard(updated.id));
}

async function handleLeadDelete(leadId: number) {
  await prisma.lead.delete({ where: { id: leadId } });
  await deleteLeadTgMessagesEverywhere(leadId);
}

async function setPendingInput(tgUserId: string, kind: "lead_price" | "lead_commission", leadId: number) {
  await prisma.pendingInput.upsert({
    where: { tgUserId },
    update: { kind, entityId: String(leadId), createdAt: new Date() },
    create: { tgUserId, kind, entityId: String(leadId) },
  });
}

async function consumePendingInput(tgUserId: string) {
  const pending = await prisma.pendingInput.findUnique({ where: { tgUserId } });
  if (!pending) return null;
  await prisma.pendingInput.delete({ where: { tgUserId } }).catch(() => null);
  return pending;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  if (!isValidSecret(req)) {
    return NextResponse.json({ ok: false, error: "bad secret" }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  if (!update) return NextResponse.json({ ok: true });

  // 1) Inline-кнопки
  if (update.callback_query) {
    const cq = update.callback_query;
    const cqId: string | undefined = cq.id;
    const data: string | undefined = cq.data;
    const tgUserId = String(cq?.from?.id ?? "");
    const chatId = String(cq?.message?.chat?.id ?? "");

    try {
      if (!data) {
        if (cqId) await answerCallbackQuery(cqId, "Ок");
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("TEST:")) {
        if (cqId) await answerCallbackQuery(cqId, `Нажато: ${data}`);
        return NextResponse.json({ ok: true });
      }

      const m = data.match(/^L:(\d+):([a-z_]+)$/i);
      if (!m) {
        if (cqId) await answerCallbackQuery(cqId, "Не понял команду");
        return NextResponse.json({ ok: true });
      }

      const leadId = Number(m[1]);
      const action = String(m[2]);

      if (!Number.isFinite(leadId)) {
        if (cqId) await answerCallbackQuery(cqId, "Некорректный ID");
        return NextResponse.json({ ok: true });
      }

      if (action === "in_progress" || action === "done" || action === "new") {
        await handleLeadStatus(leadId, action);
        if (cqId) await answerCallbackQuery(cqId, "Готово");
        return NextResponse.json({ ok: true });
      }

      if (action === "canceled") {
        // по твоей просьбе: «отмена» = удаление заявки
        await handleLeadDelete(leadId);
        if (cqId) await answerCallbackQuery(cqId, "Удалено");
        return NextResponse.json({ ok: true });
      }

      if (action === "set_price") {
        if (!tgUserId || !chatId) {
          if (cqId) await answerCallbackQuery(cqId, "Нет данных чата");
          return NextResponse.json({ ok: true });
        }

        await setPendingInput(tgUserId, "lead_price", leadId);
        await sendTelegramText(chatId, `Введите новую цену для заявки <b>#${leadId}</b> (только число).`);
        if (cqId) await answerCallbackQuery(cqId, "Жду цену");
        return NextResponse.json({ ok: true });
      }

      if (action === "set_commission") {
        if (!tgUserId || !chatId) {
          if (cqId) await answerCallbackQuery(cqId, "Нет данных чата");
          return NextResponse.json({ ok: true });
        }

        await setPendingInput(tgUserId, "lead_commission", leadId);
        await sendTelegramText(chatId, `Введите комиссию для заявки <b>#${leadId}</b> (только число).`);
        if (cqId) await answerCallbackQuery(cqId, "Жду комиссию");
        return NextResponse.json({ ok: true });
      }

      if (cqId) await answerCallbackQuery(cqId, "Неизвестное действие");
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      console.error("telegram webhook callback_query error:", e);
      if (cqId) await answerCallbackQuery(cqId, "Ошибка").catch(() => null);
      return NextResponse.json({ ok: true });
    }
  }

  // 2) Сообщение (ввод суммы)
  if (update.message) {
    const msg = update.message;
    const tgUserId = String(msg?.from?.id ?? "");
    const chatId = String(msg?.chat?.id ?? "");
    const text: string = String(msg?.text ?? "").trim();

    try {
      if (!tgUserId || !chatId) return NextResponse.json({ ok: true });
      if (text.startsWith("/")) return NextResponse.json({ ok: true });

      const pending = await consumePendingInput(tgUserId);
      if (!pending) return NextResponse.json({ ok: true });

      const amount = parseMoney(text);
      if (amount === null) {
        // возвращаем pending обратно, чтобы можно было ввести снова
        await prisma.pendingInput.upsert({
          where: { tgUserId },
          update: { kind: pending.kind, entityId: pending.entityId, createdAt: new Date() },
          create: { tgUserId, kind: pending.kind, entityId: pending.entityId },
        });
        await sendTelegramText(chatId, "Нужно число. Например: 25440");
        return NextResponse.json({ ok: true });
      }

      if (pending.kind === "lead_price" || pending.kind === "lead_commission") {
        const leadId = Number(pending.entityId);
        if (!Number.isFinite(leadId)) {
          await sendTelegramText(chatId, "Ошибка: некорректный ID заявки");
          return NextResponse.json({ ok: true });
        }

        if (pending.kind === "lead_price") {
          await prisma.lead.update({ where: { id: leadId }, data: { price: amount } });
          await sendTelegramText(chatId, `Цена для заявки <b>#${leadId}</b> обновлена: <b>${amount} ₽</b>`);
        } else {
          await prisma.lead.update({ where: { id: leadId }, data: { commission: amount } });
          await sendTelegramText(chatId, `Комиссия для заявки <b>#${leadId}</b> обновлена: <b>${amount} ₽</b>`);
        }

        const lead = await fetchLeadForMessage(leadId);
        if (lead) {
          await editLeadMessagesEverywhere(lead.id, leadMessage(lead), leadKeyboard(lead.id));
        }

        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    } catch (e: any) {
      console.error("telegram webhook message error:", e);
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ ok: true });
}