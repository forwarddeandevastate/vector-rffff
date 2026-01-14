export async function tgSendLead(payload: {
  id: number;
  name: string;
  phone: string;
  route: string;
  datetime?: string | null;
  comment?: string | null;
  isDuplicate?: boolean;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !chatId) return;

  const text =
    `🆕 Новый лид #${payload.id}${payload.isDuplicate ? " (дубликат)" : ""}\n` +
    `${payload.name}\n` +
    `${payload.phone}\n` +
    `${payload.route}` +
    (payload.datetime ? `\n🕒 ${payload.datetime}` : "") +
    (payload.comment ? `\n💬 ${payload.comment}` : "");

  // callback_data ограничен ~64 байта -> делаем компактно
  const mk = (action: string) => `lead:${payload.id}:${action}:${secret || ""}`;

  const reply_markup = {
    inline_keyboard: [
      [
        { text: "🟡 В работу", callback_data: mk("in_progress") },
        { text: "✅ Завершить", callback_data: mk("done") },
      ],
      [{ text: "⛔ Отменить", callback_data: mk("canceled") }],
    ],
  };

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      reply_markup,
    }),
  }).catch(() => {});
}
