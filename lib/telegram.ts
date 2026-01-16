type TgPayload = {
  text: string;
  parse_mode?: "HTML";
  disable_web_page_preview?: boolean;
};

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

export async function sendTelegram(text: string) {
  const enabled = (process.env.TELEGRAM_ENABLED || "true").toLowerCase();
  if (enabled === "false" || enabled === "0") {
    return { ok: true, skipped: true as const };
  }

  const token = env("TELEGRAM_BOT_TOKEN");
  const chatId = env("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    console.warn("Telegram: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { ok: false, error: "missing env" };
  }

  const payload: TgPayload = {
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      ...payload,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Telegram send failed:", res.status, data);
    return { ok: false, status: res.status, data };
  }

  return { ok: true, data };
}

export function buildLeadTelegramMessage(lead: {
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
}) {
  const lines: string[] = [];

  lines.push(`<b>Новая заявка #${lead.id}</b>`);
  lines.push(`👤 <b>${escHtml(lead.name)}</b>`);
  lines.push(`📞 <b>${escHtml(lead.phone)}</b>`);
  lines.push(`📍 <b>${escHtml(lead.fromText)}</b> → <b>${escHtml(lead.toText)}</b>`);

  if (lead.datetime) lines.push(`🕒 ${escHtml(lead.datetime)}`);

  lines.push(
    `🚗 Класс: <b>${escHtml(lead.carClass)}</b>${lead.roundTrip ? " • туда-обратно" : ""}`
  );

  if (typeof lead.price === "number") lines.push(`💰 Итог: <b>${lead.price} ₽</b>`);
  if (lead.comment) lines.push(`💬 ${escHtml(lead.comment)}`);

  return lines.join("\n");
}
