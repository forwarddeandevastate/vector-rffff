import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadKeyboard, leadMessage, sendTelegramToAll } from "@/lib/telegram";

export const runtime = "nodejs";

// 🇷🇺 СТРОГАЯ нормализация ТОЛЬКО РФ
function normalizePhoneRU(input: string): string | null {
  const digits = String(input || "").replace(/\D+/g, "");

  // 7XXXXXXXXXX
  if (/^7\d{10}$/.test(digits)) return `+${digits}`;

  // 8XXXXXXXXXX → +7
  if (/^8\d{10}$/.test(digits)) return `+7${digits.slice(1)}`;

  // 10 цифр → +7
  if (/^\d{10}$/.test(digits)) return `+7${digits}`;

  return null; // ❌ всё остальное запрещаем
}

function getCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") || "";
  const parts = raw.split(";").map((s) => s.trim());
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i === -1) continue;
    if (decodeURIComponent(p.slice(0, i)) === name) {
      return decodeURIComponent(p.slice(i + 1));
    }
  }
  return "";
}

function pickUtm(body: any, req: Request) {
  return {
    utmSource:
      body.utmSource ||
      getCookie(req, "vrf_utm_source") ||
      null,
    utmMedium:
      body.utmMedium ||
      getCookie(req, "vrf_utm_medium") ||
      null,
    utmCampaign:
      body.utmCampaign ||
      getCookie(req, "vrf_utm_campaign") ||
      null,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 🛡 honeypot
    if (String(body.company || "").trim()) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const name = String(body.name || "").trim();
    const phoneRaw = String(body.phone || "").trim();
    const phone = normalizePhoneRU(phoneRaw);

    const fromText = String(body.fromText || body.from || "").trim();
    const toText = String(body.toText || body.to || "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Введите имя" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Введите телефон в формате РФ" },
        { status: 400 }
      );
    }

    if (!fromText || !toText) {
      return NextResponse.json(
        { ok: false, error: "Укажите маршрут" },
        { status: 400 }
      );
    }

    const utm = pickUtm(body, req);

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        fromText,
        toText,
        datetime: body.datetime || null,
        comment: body.comment || null,
        carClass: body.carClass || "standard",
        roundTrip: Boolean(body.roundTrip),
        price:
          typeof body.price === "number"
            ? Math.round(body.price)
            : null,
        status: "new",
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
      },
    });

    const sourceLine =
      utm.utmSource || utm.utmCampaign
        ? `\n\nИсточник: ${utm.utmSource || "—"} / ${utm.utmMedium || "—"} / ${utm.utmCampaign || "—"}`
        : "";

    await sendTelegramToAll(
      leadMessage(lead) + sourceLine,
      leadKeyboard(lead.id)
    );

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (e: any) {
    console.error("LEADS API ERROR:", e);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
