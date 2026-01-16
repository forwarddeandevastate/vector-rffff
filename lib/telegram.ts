type TgApiResult = { ok: boolean; [k: string]: any };

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
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

function escHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ✅ Отправка сообщения (с кнопками)
export async function sendTelegramText(chatId: string, htmlText: string, keyboard?: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: htmlText,
      parse_mode: "HTML",
      reply_markup: keyboard || undefined,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) return { ok: false, status: res.status, data };
  return { ok: true, data };
}


// ✅ Кнопки управления лидом
export function leadKeyboard(leadId: number) {
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

// ✅ Текст заявки
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
