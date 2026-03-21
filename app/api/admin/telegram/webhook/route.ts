import { NextResponse } from "next/server";
import { requireAdminOrThrow } from "@/lib/admin-api";

export const runtime = "nodejs";

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

const WEBHOOK_URL =
  env("TELEGRAM_WEBHOOK_URL") ||
  "https://vector-rf.ru/api/telegram/webhook";

async function tg(method: string, body?: any) {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body || {}),
    }
  );

  return res.json();
}

// GET — статус webhook для admin UI
// Возвращаем формат который ждёт settings/ui.tsx:
// { ok, webhookInfo, webhookUrlExpected, secretExpected }
export async function GET() {
  try {
    await requireAdminOrThrow();
  } catch {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const secret = env("TELEGRAM_WEBHOOK_SECRET");
  const botToken = env("TELEGRAM_BOT_TOKEN");

  if (!botToken) {
    return NextResponse.json({
      ok: false,
      error: "TELEGRAM_BOT_TOKEN не задан в переменных окружения",
    }, { status: 400 });
  }

  const data = await tg("getWebhookInfo").catch((e: any) => ({
    ok: false,
    error: String(e?.message || e),
  }));

  // Telegram возвращает { ok: true, result: { url, ... } }
  // Преобразуем в формат который ждёт UI
  return NextResponse.json({
    ok: !!data.ok,
    webhookInfo: data.result ?? null,          // { url, pending_update_count, last_error_message, ... }
    webhookUrlExpected: WEBHOOK_URL,            // что должно быть установлено
    secretExpected: !!secret,                  // задан ли секрет
    error: data.ok ? undefined : data.description,
  });
}

// POST — установить webhook
export async function POST() {
  try {
    await requireAdminOrThrow();
  } catch {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const secret = env("TELEGRAM_WEBHOOK_SECRET");
  const botToken = env("TELEGRAM_BOT_TOKEN");

  if (!botToken) {
    return NextResponse.json({
      ok: false,
      error: "TELEGRAM_BOT_TOKEN не задан в переменных окружения",
    }, { status: 400 });
  }

  const body: Record<string, any> = {
    url: WEBHOOK_URL,
    allowed_updates: ["callback_query", "message"],
    drop_pending_updates: true,
    max_connections: 40,
  };

  if (secret) {
    body.secret_token = secret;
  }

  const data = await tg("setWebhook", body).catch((e: any) => ({
    ok: false,
    description: String(e?.message || e),
  }));

  return NextResponse.json({
    ok: !!data.ok,
    description: data.description,
    webhookUrl: WEBHOOK_URL,
    secretSet: !!secret,
  });
}

// DELETE — удалить webhook
export async function DELETE() {
  try {
    await requireAdminOrThrow();
  } catch {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const data = await tg("deleteWebhook", {
    drop_pending_updates: true,
  }).catch((e: any) => ({ ok: false, description: String(e?.message || e) }));

  return NextResponse.json({ ok: !!data.ok, description: data.description });
}
