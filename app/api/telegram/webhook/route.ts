import { NextResponse } from "next/server";
import { requireAdminOrThrow } from "@/lib/admin-api";

export const runtime = "nodejs";

type TgApiResult = { ok: boolean; [k: string]: any };

function env(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

function tgBase() {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return `https://api.telegram.org/bot${token}`;
}

function defaultWebhookUrl() {
  // Можно переопределить на staging/preview
  return env("TELEGRAM_WEBHOOK_URL") || "https://vector-rf.ru/api/telegram/webhook";
}

async function tgCall(method: string, body?: any) {
  const res = await fetch(`${tgBase()}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = (await res.json().catch(() => null)) as TgApiResult | null;
  return { res, data };
}

export async function GET() {
  try {
    await requireAdminOrThrow();

    const { res, data } = await tgCall("getWebhookInfo");
    if (!res.ok || !data?.ok) {
      return NextResponse.json({ ok: false, error: "getWebhookInfo failed", data }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      webhookUrlExpected: defaultWebhookUrl(),
      secretExpected: env("TELEGRAM_WEBHOOK_SECRET") ? true : false,
      webhookInfo: data.result,
    });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}

export async function POST() {
  try {
    await requireAdminOrThrow();

    const url = defaultWebhookUrl();
    const secret = env("TELEGRAM_WEBHOOK_SECRET");

    const payload: any = {
      url,
      allowed_updates: ["callback_query", "message"],
      drop_pending_updates: true,
    };

    // ВАЖНО: если секрет задан — Telegram будет присылать x-telegram-bot-api-secret-token
    if (secret) payload.secret_token = secret;

    const { res, data } = await tgCall("setWebhook", payload);
    if (!res.ok || !data?.ok) {
      return NextResponse.json({ ok: false, error: "setWebhook failed", data }, { status: 500 });
    }

    const info = await tgCall("getWebhookInfo");

    return NextResponse.json({
      ok: true,
      setTo: url,
      usedSecret: !!secret,
      setWebhookResult: data.result,
      webhookInfo: info.data?.result || null,
    });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}

export async function DELETE() {
  try {
    await requireAdminOrThrow();

    const { res, data } = await tgCall("deleteWebhook", { drop_pending_updates: true });
    if (!res.ok || !data?.ok) {
      return NextResponse.json({ ok: false, error: "deleteWebhook failed", data }, { status: 500 });
    }

    return NextResponse.json({ ok: true, result: data.result });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}