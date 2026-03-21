import { NextResponse } from "next/server";
import { requireAdminOrThrow } from "@/lib/admin-api";
import { sendTelegramToAll } from "@/lib/telegram";

export const runtime = "nodejs";

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

// GET — полная диагностика без отправки сообщений
export async function GET() {
  try {
    await requireAdminOrThrow();
  } catch {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const botToken = env("TELEGRAM_BOT_TOKEN");
  const chatIds = env("TELEGRAM_CHAT_IDS") || env("TELEGRAM_CHAT_ID");
  const webhookSecret = env("TELEGRAM_WEBHOOK_SECRET");
  const webhookUrl = env("TELEGRAM_WEBHOOK_URL") || "https://vector-rf.ru/api/telegram/webhook";
  const enabled = (process.env.TELEGRAM_ENABLED || "true").toLowerCase();

  const diag: Record<string, any> = {
    env: {
      TELEGRAM_BOT_TOKEN: botToken ? `✓ задан (${botToken.slice(0, 10)}...)` : "✗ НЕ ЗАДАН",
      TELEGRAM_CHAT_IDS: chatIds ? `✓ ${chatIds}` : "✗ НЕ ЗАДАН",
      TELEGRAM_WEBHOOK_URL: `${webhookUrl}`,
      TELEGRAM_WEBHOOK_SECRET: webhookSecret ? "✓ задан" : "✗ не задан (не обязательно)",
      TELEGRAM_ENABLED: enabled,
    },
  };

  // Проверяем токен через getMe
  if (botToken) {
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`).catch(() => null);
    const me = await meRes?.json().catch(() => null);
    diag.bot = me?.ok ? {
      ok: true,
      username: me.result?.username,
      name: me.result?.first_name,
      id: me.result?.id,
    } : { ok: false, error: me?.description || "Ошибка запроса", raw: me };
  } else {
    diag.bot = { ok: false, error: "TELEGRAM_BOT_TOKEN не задан" };
  }

  // Проверяем webhook
  if (botToken) {
    const whRes = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`).catch(() => null);
    const wh = await whRes?.json().catch(() => null);
    const webhookInfo = wh?.result;
    const currentUrl = webhookInfo?.url || "";
    const urlMatch = currentUrl === webhookUrl;

    diag.webhook = {
      ok: !!currentUrl,
      current_url: currentUrl || "(не установлен)",
      expected_url: webhookUrl,
      url_match: urlMatch,
      url_match_status: urlMatch ? "✓ совпадает" : "✗ НЕ СОВПАДАЕТ — нажмите 'Установить webhook'",
      pending_updates: webhookInfo?.pending_update_count ?? 0,
      last_error: webhookInfo?.last_error_message || null,
      last_error_date: webhookInfo?.last_error_date
        ? new Date(webhookInfo.last_error_date * 1000).toLocaleString("ru-RU")
        : null,
      max_connections: webhookInfo?.max_connections,
      allowed_updates: webhookInfo?.allowed_updates,
    };
  } else {
    diag.webhook = { ok: false, error: "Нет токена для проверки" };
  }

  // Итоговый статус
  const allOk =
    !!botToken &&
    !!chatIds &&
    diag.bot?.ok &&
    diag.webhook?.ok &&
    diag.webhook?.url_match;

  diag.summary = allOk
    ? "✅ Всё настроено корректно"
    : "❌ Есть проблемы — смотрите поля выше";

  return NextResponse.json({ ok: true, diag });
}

// POST — отправить тестовое сообщение
export async function POST() {
  try {
    await requireAdminOrThrow();
  } catch {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const r = await sendTelegramToAll(
    "🔔 <b>Тест Вектор РФ</b>\n\nTelegram-уведомления работают ✅\n\nЕсли видите это — кнопки тоже должны работать.",
    {
      inline_keyboard: [
        [{ text: "✅ Тест кнопки", callback_data: "TEST:ping" }],
      ],
    }
  );

  return NextResponse.json({ ok: true, result: r });
}
