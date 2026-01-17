import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadKeyboard, leadMessage, sendTelegramToAll } from "@/lib/telegram";

export const runtime = "nodejs";

// простая нормализация телефона
function normalizePhone(input: string) {
  const digits = (input || "").replace(/\D+/g, "");
  // допускаем +7 / 8 / любой
  return digits;
}

function getCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") || "";
  const parts = raw.split(";").map((s) => s.trim());
  for (const p of parts) {
    if (!p) continue;
    const i = p.indexOf("=");
    if (i === -1) continue;
    const k = decodeURIComponent(p.slice(0, i).trim());
    const v = decodeURIComponent(p.slice(i + 1).trim());
    if (k === name) return v;
  }
  return "";
}

function pickUtm(body: any, req: Request) {
  // 1) приоритет: из body (если фронт передаст)
  const utmSource = typeof body.utmSource === "string" ? body.utmSource.trim() : "";
  const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.trim() : "";
  const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.trim() : "";

  // 2) fallback: из cookie, если body пустой
  const cSource = getCookie(req, "vrf_utm_source");
  const cMedium = getCookie(req, "vrf_utm_medium");
  const cCampaign = getCookie(req, "vrf_utm_campaign");

  return {
    utmSource: utmSource || cSource || null,
    utmMedium: utmMedium || cMedium || null,
    utmCampaign: utmCampaign || cCampaign || null,
    // доп. полезное (в схеме есть поля — если их нет, просто не запишем)
    landing: getCookie(req, "vrf_landing") || null,
    referrer: getCookie(req, "vrf_ref") || null,
    utmTerm: getCookie(req, "vrf_utm_term") || null,
    utmContent: getCookie(req, "vrf_utm_content") || null,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 🛡 Антибот: honeypot поле. На фронте добавим скрытое поле "company"
    // Если бот заполнит — тихо "успех", но лид не создаём.
    const honeypot = String(body.company || "").trim();
    if (honeypot) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const name = String(body.name || "").trim();
    const phoneRaw = String(body.phone || "").trim();
    const phoneDigits = normalizePhone(phoneRaw);

    const fromText = String(body.fromText || body.from || "").trim();
    const toText = String(body.toText || body.to || "").trim();

    const carClass = String(body.carClass || "standard").trim();
    const roundTrip = Boolean(body.roundTrip);

    const datetime = body.datetime ? String(body.datetime).trim() : null;
    const comment = body.comment ? String(body.comment).trim() : null;

    const price =
      body.price === null || body.price === undefined
        ? null
        : Number.isFinite(Number(body.price))
        ? Math.round(Number(body.price))
        : null;

    if (!name || name.length < 2)
      return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 400 });

    // телефон: минимум 6 цифр, лучше 10+
    if (!phoneDigits || phoneDigits.length < 6)
      return NextResponse.json({ ok: false, error: "Введите телефон" }, { status: 400 });

    if (!fromText)
      return NextResponse.json({ ok: false, error: "Укажите откуда" }, { status: 400 });
    if (!toText)
      return NextResponse.json({ ok: false, error: "Укажите куда" }, { status: 400 });

    // 🔎 источник рекламы
    const utm = pickUtm(body, req);

    // Собираем data так, чтобы не падать, если каких-то полей в Prisma нет.
    const data: any = {
      name,
      phone: phoneRaw, // оставляем красиво как ввёл пользователь
      fromText,
      toText,
      datetime,
      carClass,
      roundTrip,
      price,
      comment,
      status: "new",
    };

    // В твоей схеме есть utmSource/utmMedium/utmCampaign — пишем их
    if (utm.utmSource) data.utmSource = utm.utmSource;
    if (utm.utmMedium) data.utmMedium = utm.utmMedium;
    if (utm.utmCampaign) data.utmCampaign = utm.utmCampaign;

    // Эти поля есть не у всех — добавляем только если ты потом их добавишь в схему
    // (сейчас они просто не запишутся и не сломают код)
    // Если хочешь — добавим в Prisma позже.
    // data.landing = utm.landing;
    // data.referrer = utm.referrer;
    // data.utmTerm = utm.utmTerm;
    // data.utmContent = utm.utmContent;

    const lead = await prisma.lead.create({
      data,
      select: {
        id: true,
        name: true,
        phone: true,
        fromText: true,
        toText: true,
        datetime: true,
        carClass: true,
        roundTrip: true,
        comment: true,
        price: true,
        status: true,
        utmSource: true,
        utmMedium: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    // ✅ чтобы в Telegram тоже было видно источник (когда есть)
    const sourceLine =
      lead.utmSource || lead.utmCampaign
        ? `\n\nИсточник: ${lead.utmSource || "—"} / ${lead.utmMedium || "—"} / ${lead.utmCampaign || "—"}`
        : "";

    const tg = await sendTelegramToAll(leadMessage(lead) + sourceLine, leadKeyboard(lead.id));

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      telegramOk: !!tg?.ok,
    });
  } catch (e: any) {
    console.error("LEADS API ERROR:", e);
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
