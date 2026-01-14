import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { sendTelegram } from "@/lib/telegram";

export async function POST() {
  try {
    await requireAdmin();

    const r = await sendTelegram(`<b>Тест</b>\nTelegram уведомления работают ✅`);
    if (!r.ok && !(r as any).skipped) {
      return NextResponse.json({ ok: false, error: "Telegram send failed", details: r }, { status: 500 });
    }
    return NextResponse.json({ ok: true, result: r });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
