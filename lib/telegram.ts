import { prisma } from "@/lib/prisma";

type TgApiResult = { ok: boolean; [k: string]: any };

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

function escHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function tgEnabled() {
  const enabled = (process.env.TELEGRAM_ENABLED || "true").toLowerCase();
  return !(enabled === "false" || enabled === "0");
}

function tgBase() {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return `https://api.telegram.org/bot${token}`;
}

export async function sendTelegramText(chatId: string, htmlText: string, keyboard?: any) {
  if (!tgEnabled()) return { ok: true, skipped: true as const };

  const res = await fetch(`${tgBase()}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: htmlText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: keyboard ? keyboard : undefined,
    }),
  });

  const data = (await res.json().catch(() => null)) as TgApiResult | null;
  if (!res.ok || !data?.ok) {
    console.error("TG sendMessage failed", res.status, data);
    return { ok: false, status: res.status, data };
  }
  return { ok: true, data };
}

export async function editTelegramMessage(chatId: string, messageId: number, htmlText: string, keyboard?: any) {
  if (!tgEnabled()) return { ok: true, skipped: true as const };

  const res = await fetch(`${tgBase()}/editMessageText`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: htmlText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: keyboard ? keyboard : undefined,
    }),
  });

  const data = (await res.json().catch(() => null)) as TgApiResult | null;
  if (!res.ok || !data?.ok) {
    console.error("TG editMessageText failed", res.status, data);
    return { ok: false, status: res.status, data };
  }
  return { ok: true, data };
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  if (!tgEnabled()) return { ok: true, skipped: true as const };

  const res = await fetch(`${tgBase()}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || undefined,
      show_alert: false,
    }),
  });

  const data = (await res.json().catch(() => null)) as TgApiResult | null;
  if (!res.ok || !data?.ok) {
    console.error("TG answerCallbackQuery failed", res.status, data);
    return { ok: false, status: res.status, data };
  }
  return { ok: true, data };
}

export function leadKeyboard(leadId: number) {
  // callback_data максимум 64 байта — делаем коротко
  return {
    inline_keyboard: [
      [
        { text: "✅ В работу", callback_data: `L:${leadId}:in_progress` },
        { text: "✅ Завершить", callback_data: `L:${leadId}:done` },
      ],
      [{ text: "❌ Отменить", callback_data: `L:${leadId}:canceled` }],
    ],
  };
}

export function leadMessage(lead: {
  id: number;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  datetime?: string | null;
  carClass: string;
  roundTrip?: boolean | null;
  comment?: string | null;
  price?: number | null;
  status?: string | null;
}) {
  const status = lead.status || "new";

  const statusLabel =
    status === "new"
      ? "🟦 NEW"
      : status === "in_progress"
      ? "🟨 В РАБОТЕ"
      : status === "done"
      ? "🟩 ЗАВЕРШЕНО"
      : status === "canceled"
      ? "🟥 ОТМЕНЕНО"
      : `ℹ️ ${escHtml(status)}`;

  const lines: string[] = [];
  lines.push(`<b>Заявка #${lead.id}</b>  ${statusLabel}`);
  lines.push(`👤 <b>${escHtml(lead.name)}</b>`);
  lines.push(`📞 <b>${escHtml(lead.phone)}</b>`);
  lines.push(`📍 <b>${escHtml(lead.fromText)}</b> → <b>${escHtml(lead.toText)}</b>`);
  if (lead.datetime) lines.push(`🕒 ${escHtml(lead.datetime)}`);
  lines.push(`🚗 Класс: <b>${escHtml(lead.carClass)}</b>${lead.roundTrip ? " • туда-обратно" : ""}`);
  if (typeof lead.price === "number") lines.push(`💰 Итог: <b>${lead.price} ₽</b>`);
  if (lead.comment) lines.push(`💬 ${escHtml(lead.comment)}`);
  return lines.join("\n");
}

export async function updateLeadStatusFromTelegram(leadId: number, status: string) {
  // минимальная защита: разрешаем только наши статусы
  const allowed = new Set(["new", "in_progress", "done", "canceled"]);
  if (!allowed.has(status)) throw new Error("bad status");

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
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

  return updated;
}
