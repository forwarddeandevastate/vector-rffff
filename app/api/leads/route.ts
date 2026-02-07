import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadKeyboard, leadMessage, sendTelegramToAll } from "@/lib/telegram";

export const runtime = "nodejs";

/**
 * Anti-bot ENV (опционально):
 * BOT_RATE_LIMIT_PER_MIN=12
 * BOT_DUPLICATE_WINDOW_SEC=20
 * BOT_REQUIRE_REFERER=1
 * BOT_BLOCK_IPS=1.2.3.4,5.6.7.8
 * BOT_BLOCK_UA_CONTAINS=python-requests,curl,wget,axios,httpclient,bot,spider,crawler,headless
 */

const RATE_LIMIT_PER_MIN = clampInt(process.env.BOT_RATE_LIMIT_PER_MIN, 12, 3, 60);
const DUPLICATE_WINDOW_SEC = clampInt(process.env.BOT_DUPLICATE_WINDOW_SEC, 20, 5, 180);
const REQUIRE_REFERER = (process.env.BOT_REQUIRE_REFERER ?? "1") === "1";

const BLOCK_IPS = parseList(process.env.BOT_BLOCK_IPS);
const BLOCK_UA_CONTAINS = parseList(
  process.env.BOT_BLOCK_UA_CONTAINS ??
    "python-requests,curl,wget,axios,httpclient,bot,spider,crawler,headless"
).map((s) => s.toLowerCase());

// In-memory защита (на Vercel может сбрасываться между инстансами — но всё равно режет много мусора)
type Hit = { ts: number };
const ipHits = new Map<string, Hit[]>();
const lastPayloadByIp = new Map<string, { hash: string; ts: number }>();

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
    utmSource: body.utmSource || getCookie(req, "vrf_utm_source") || null,
    utmMedium: body.utmMedium || getCookie(req, "vrf_utm_medium") || null,
    utmCampaign: body.utmCampaign || getCookie(req, "vrf_utm_campaign") || null,
  };
}

function getClientIp(req: Request): string {
  // Vercel / прокси
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return req.headers.get("x-real-ip") || "";
}

function silentOk(extra?: Record<string, any>) {
  // ВАЖНО: “тихий успех”, чтобы бот не понял, что его режут
  return NextResponse.json({ ok: true, ignored: true, ...(extra || {}) });
}

function sha1(s: string) {
  return require("crypto").createHash("sha1").update(s).digest("hex");
}

function clampInt(v: any, def: number, min: number, max: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function parseList(v?: string) {
  if (!v) return [];
  return v
    .split(/[,\n;]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isSuspiciousHeaders(req: Request) {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const accept = req.headers.get("accept") || "";
  const lang = req.headers.get("accept-language") || "";
  const referer = req.headers.get("referer") || "";

  // Явные боты по UA
  if (ua && BLOCK_UA_CONTAINS.some((x) => ua.includes(x))) return { bad: true, reason: "ua_block" };

  // Иногда скрипты шлют пустые заголовки
  if (!ua || ua.length < 8) return { bad: true, reason: "ua_missing" };

  // Для “нормальных” браузеров обычно есть accept-language
  if (!lang) return { bad: true, reason: "lang_missing" };

  // Если хотим требовать реферер (обычно есть при переходе с сайта; но бывают исключения)
  if (REQUIRE_REFERER && !referer) {
    // Не блокируем прям “жёстко”, но считаем подозрительным
    return { bad: true, reason: "referer_missing" };
  }

  // accept часто у браузеров содержит text/html или */*
  if (accept && !accept.includes("text/html") && !accept.includes("*/*")) {
    return { bad: true, reason: "accept_weird" };
  }

  return { bad: false as const, reason: "" };
}

function rateLimit(ip: string) {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((h) => now - h.ts < 60_000);
  hits.push({ ts: now });
  ipHits.set(ip, hits);
  return hits.length > RATE_LIMIT_PER_MIN;
}

function duplicateGuard(ip: string, payloadHash: string) {
  const now = Date.now();
  const prev = lastPayloadByIp.get(ip);
  if (prev && prev.hash === payloadHash && now - prev.ts < DUPLICATE_WINDOW_SEC * 1000) {
    return true;
  }
  lastPayloadByIp.set(ip, { hash: payloadHash, ts: now });
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // 🛡 honeypot
    if (String(body.company || "").trim()) {
      return silentOk();
    }

    const ip = getClientIp(req);

    // 1) IP block list
    if (ip && BLOCK_IPS.includes(ip)) {
      return silentOk();
    }

    // 2) Rate-limit (если IP есть)
    if (ip && rateLimit(ip)) {
      console.warn("[LEADS][BOT] rate_limit", { ip });
      return silentOk();
    }

    // 3) Header/UA эвристики (НЕ ломаем людям — режем только явные)
    const hdr = isSuspiciousHeaders(req);
    // если причина "referer_missing" — это может быть человек, но часто бот.
    // Поэтому: при referer_missing не режем сразу, а усилим проверку на дубликат/частоту.
    const hardBlockReasons = new Set(["ua_block", "ua_missing", "lang_missing", "accept_weird"]);
    if (hdr.bad && hardBlockReasons.has(hdr.reason)) {
      console.warn("[LEADS][BOT] headers", { ip, reason: hdr.reason, ua: req.headers.get("user-agent") });
      return silentOk();
    }

    const name = String(body.name || "").trim();
    const phoneRaw = String(body.phone || "").trim();
    const phone = normalizePhoneRU(phoneRaw);

    const fromText = String(body.fromText || body.from || "").trim();
    const toText = String(body.toText || body.to || "").trim();

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Введите имя" }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ ok: false, error: "Введите телефон в формате РФ" }, { status: 400 });
    }

    if (!fromText || !toText) {
      return NextResponse.json({ ok: false, error: "Укажите маршрут" }, { status: 400 });
    }

    // 4) Анти-дубликаты: одинаковая заявка с одного IP за короткое время
    if (ip) {
      const payloadHash = sha1(
        JSON.stringify({
          name: name.toLowerCase(),
          phone,
          fromText: fromText.toLowerCase(),
          toText: toText.toLowerCase(),
          carClass: String(body.carClass || "standard"),
          roundTrip: Boolean(body.roundTrip),
        })
      );

      // Если referer отсутствует — считаем более подозрительным, и дубликаты режем особенно строго
      const isDup = duplicateGuard(ip, payloadHash);
      if (isDup) {
        console.warn("[LEADS][BOT] duplicate", { ip, reason: "same_payload_fast" });
        return silentOk();
      }

      if (hdr.bad && hdr.reason === "referer_missing") {
        // “мягкий” бан: если реферера нет, но заявка выглядит ок — всё равно пропускаем.
        // Просто отметим в логах, чтобы видеть масштаб.
        console.warn("[LEADS][SUSPECT] no_referer", { ip });
      }
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
        price: typeof body.price === "number" ? Math.round(body.price) : null,
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

    await sendTelegramToAll(leadMessage(lead) + sourceLine, leadKeyboard(lead.id));

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (e: any) {
    console.error("LEADS API ERROR:", e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
