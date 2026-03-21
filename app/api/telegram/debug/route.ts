/**
 * GET  /api/telegram/debug  — полная диагностика Telegram
 * POST /api/telegram/debug  — симуляция нажатия кнопки { leadId, action }
 *
 * ⚠️  Временный endpoint для отладки. После решения проблемы удалить.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

export async function GET() {
  const botToken = env("TELEGRAM_BOT_TOKEN");
  const chatIds  = env("TELEGRAM_CHAT_IDS") || env("TELEGRAM_CHAT_ID");
  const secret   = env("TELEGRAM_WEBHOOK_SECRET");
  const hookUrl  = env("TELEGRAM_WEBHOOK_URL") || "https://vector-rf.ru/api/telegram/webhook";

  const out: Record<string, any> = {
    env: {
      BOT_TOKEN:      botToken ? `✅ (${botToken.slice(0,12)}...)` : "❌ NOT SET",
      CHAT_IDS:       chatIds  || "❌ NOT SET",
      WEBHOOK_URL:    hookUrl,
      WEBHOOK_SECRET: secret   ? "✅ SET"     : "⚠️  not set",
    },
  };

  if (!botToken) {
    return NextResponse.json({ ...out, error: "TELEGRAM_BOT_TOKEN not set" });
  }

  // getMe
  const meR = await fetch(`https://api.telegram.org/bot${botToken}/getMe`).catch(() => null);
  const me  = await meR?.json().catch(() => null);
  out.bot   = me?.ok ? { ok: true, username: me.result?.username, id: me.result?.id } : { ok: false, raw: me };

  // getWebhookInfo
  const wiR  = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`).catch(() => null);
  const wi   = await wiR?.json().catch(() => null);
  const info = wi?.result ?? {};
  out.webhook = {
    current_url:    info.url || "(not set)",
    expected_url:   hookUrl,
    urls_match:     info.url === hookUrl ? "✅ match" : "❌ MISMATCH — click 'Install webhook'",
    pending:        info.pending_update_count ?? "?",
    last_error:     info.last_error_message   || null,
    last_error_at:  info.last_error_date ? new Date(info.last_error_date * 1000).toISOString() : null,
    allowed:        info.allowed_updates,
  };

  // DB check
  try {
    const msgCount = await prisma.telegramMessage.count();
    const latest   = await prisma.telegramMessage.findMany({
      orderBy: { createdAt: "desc" }, take: 3,
      select: { chatId: true, messageId: true, leadId: true, createdAt: true },
    });
    out.db = { telegram_messages: msgCount, latest };
  } catch (e: any) {
    out.db = { error: e.message };
  }

  // Summary
  out.summary = (out.bot?.ok && info.url === hookUrl)
    ? "✅ Config looks correct"
    : "❌ Problems found — see details above";

  return NextResponse.json(out);
}

// POST — симуляция нажатия кнопки через прямой вызов своего webhook
export async function POST(req: Request) {
  const body   = await req.json().catch(() => ({}));
  const leadId = Number(body.leadId ?? 1);
  const action = String(body.action ?? "in_progress");

  const hookUrl = env("TELEGRAM_WEBHOOK_URL") || "https://vector-rf.ru/api/telegram/webhook";
  const secret  = env("TELEGRAM_WEBHOOK_SECRET");

  const fakeUpdate = {
    update_id: 999_000 + Math.floor(Math.random() * 1000),
    callback_query: {
      id:      `debug-${Date.now()}`,
      from:    { id: 1, first_name: "Debug", username: "debuguser" },
      message: { message_id: 1, chat: { id: body.chatId ?? 1, type: "private" }, text: "debug" },
      data:    `L:${leadId}:${action}`,
    },
  };

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (secret) headers["x-telegram-bot-api-secret-token"] = secret;

  try {
    const r    = await fetch(hookUrl, { method: "POST", headers, body: JSON.stringify(fakeUpdate) });
    const text = await r.text();
    return NextResponse.json({
      sent_to:    hookUrl,
      fake_data:  fakeUpdate.callback_query.data,
      status:     r.status,
      response:   text,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
