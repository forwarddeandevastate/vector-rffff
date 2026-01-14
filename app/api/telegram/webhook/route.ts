import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !secret) return NextResponse.json({ ok: true });

  const body = await req.json().catch(() => ({}));
  const cb = body?.callback_query;
  if (!cb?.data) return NextResponse.json({ ok: true });

  // callback_data: lead:<id>:<status>:<secret>
  const parts = String(cb.data).split(":");
  if (parts.length < 4 || parts[0] !== "lead") return NextResponse.json({ ok: true });

  const leadId = Number(parts[1]);
  const status = parts[2];
  const s = parts.slice(3).join(":"); // на случай двоеточий (редко)

  if (s !== secret) return NextResponse.json({ ok: true });
  if (!Number.isFinite(leadId)) return NextResponse.json({ ok: true });

  if (!["new", "in_progress", "done", "canceled"].includes(status)) {
    return NextResponse.json({ ok: true });
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
    select: { id: true },
  });

  // ответим Telegram, чтобы “часики” пропали
  const callback_query_id = cb.id;
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      callback_query_id,
      text: "Готово ✅",
      show_alert: false,
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
