type TgApiResult = { ok: boolean; [k: string]: any };

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

function tgEnabled() {
  const enabled = (process.env.TELEGRAM_ENABLED || "true").toLowerCase();
  return !(enabled === "false" || enabled === "0");
}

/**
 * TELEGRAM_CHAT_IDS="id1,id2,id3"
 * Пример: "123456789,825985519,-100987654321"
 */
function getChatIds(): string[] {
  const ids = env("TELEGRAM_CHAT_IDS") || env("TELEGRAM_CHAT_ID"); // поддержка старого ключа на всякий
  if (!ids) return [];
  return ids
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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

// ✅ Отправка сообщения (с кнопками) сразу во все чаты из TELEGRAM_CHAT_IDS
export async function sendTelegramText(
  htmlText: string,
  keyboard?: { inline_keyboard: Array<Array<{ text: string; callback_data: string }>> }
) {
  if (!tgEnabled()) return { ok: true, skipped: true as const };

  const chatIds = getChatIds();
  if (!chatIds.length) {
    console.warn("Telegram: Missing TELEGRAM_CHAT_IDS (or TELEGRAM_CHAT_ID)");
    return { ok: false, error: "no chat ids" };
  }

  const results: Array<{ chatId: string; ok: boolean; status?: number; data?: any }> = [];

  for (const chatId of chatIds) {
    const payload: any = {
      chat_id: chatId,
      text: htmlText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };
    if (keyboard) payload.reply_markup = keyboard;

    const res = await fetch(`${tgBase()}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as TgApiResult | null;

    const ok = !!(res.ok && data?.ok);
    results.push({ chatId, ok, status: res.status, data });

    if (!ok) console.error("TG sendMessage failed:", { chatId, status: res.status, data });
  }

  return { ok: results.every((r) => r.ok), results };
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

// ✅ Текст заявки (HTML)
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
