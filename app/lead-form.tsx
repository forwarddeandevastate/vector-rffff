"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GooglePlacesInput from "@/app/ui/google-places-input";

export type CarClass = "standard" | "comfort" | "business" | "minivan";
export type RouteType = "city" | "airport" | "intercity";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function formatRub(n: number) {
  const s = String(Math.round(n));
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(s.slice(start, i));
  }
  return `${parts.join(" ")} ₽`;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

// тарифы
const PER_KM: Record<CarClass, number> = {
  standard: 31,
  comfort: 46,
  minivan: 55,
  business: 80,
};

const CITY_LANDING_FEE = 500;
const CITY_PER_KM_ADD = 5;

const AIRPORT_SURCHARGE_MSK_SPB = 1000;
const MIN_INTERCITY_PRICE = 1500;
const AIRPORT_PICKUP_SURCHARGE = 800;
const AIRPORT_DROPOFF_SURCHARGE = 700;

const CITY_BASE_PRICE: Record<CarClass, number> = {
  standard: 1000,
  comfort: 1500,
  business: 3000,
  minivan: 3500,
};

function formatFrom(n: number) {
  return `от ${n.toLocaleString("ru-RU")} ₽`;
}

const POPULAR_CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Сочи",
  "Екатеринбург",
  "Новосибирск",
  "Нижний Новгород",
  "Самара",
  "Ростов-на-Дону",
  "Краснодар",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
  "Волгоград",
  "Омск",
  "Челябинск",
  "Калининград",
  "Тюмень",
  "Иркутск",
  "Хабаровск",
  "Владивосток",
  "Донецк (ДНР)",
  "Луганск (ЛНР)",
  "Макеевка (ДНР)",
  "Мариуполь (ДНР)",
  "Горловка (ДНР)",
  "Енакиево (ДНР)",
  "Алчевск (ЛНР)",
  "Стаханов (ЛНР)",
  "Северодонецк (ЛНР)",
  "Лисичанск (ЛНР)",
  "Запорожье",
  "Мелитополь",
  "Бердянск",
  "Херсон",
  "Геническ",
  "Скадовск",
  "Новая Каховка",
];

const AIRPORT_HINTS = [
  "Шереметьево (SVO)",
  "Домодедово (DME)",
  "Внуково (VKO)",
  "Пулково (LED)",
  "Сочи (AER)",
  "Кольцово (SVX)",
  "Толмачёво (OVB)",
  "Курумоч (KUF)",
  "Казань (KZN)",
  "Пашковский (KRR)",
  "Храброво (KGD)",
];

const POPULAR_ROUTES = [
  { from: "Москва", to: "Нижний Новгород", icon: "🇷🇺" },
  { from: "Москва", to: "Казань", icon: "🇧🇾" },
  { from: "Москва", to: "Тверь", icon: "🟠" },
  { from: "Москва", to: "Владимир", icon: "🟡" },
  { from: "СПБ", to: "Пулково", icon: "✈️" },
  { from: "СПБ", to: "Москва", icon: "🇷🇺" },
];

function looksLikeAirport(s: string) {
  const v = normalize(s);
  if (!v) return false;
  if (v.includes("аэроп")) return true;

  const airportTokens = [
    "шереметьево",
    "домодедово",
    "внуково",
    "пулково",
    "храброво",
    "кольцово",
    "толмач",
    "курумоч",
    "пашков",
    "адлер",
    "сочи",
    "казань",
    "аэропорт",
  ];

  if (airportTokens.some((t) => v.includes(t))) return true;
  if (/\b(svo|dme|vko|led|aer|svx|ovb|kuf|kzn|krr|kgd)\b/i.test(s)) return true;

  return AIRPORT_HINTS.some((x) => {
    const nx = normalize(x);
    if (nx === v) return true;
    const baseName = nx.replace(/\s*\([^)]*\)\s*/g, "").trim();
    return baseName && v.includes(baseName);
  });
}

function isMskOrSpb(s: string) {
  const v = normalize(s);
  if (!v) return false;
  if (v.includes("москва") || v.includes("moscow")) return true;
  if (
    v.includes("санкт") ||
    v.includes("петербург") ||
    v.includes("спб") ||
    v.includes("saint petersburg") ||
    v.includes("st petersburg")
  ) {
    return true;
  }
  return false;
}

function sameCity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return false;

  const CITIES = [
    "москва",
    "санкт-петербург",
    "санкт петербург",
    "спб",
    "казань",
    "нижний новгород",
    "екатеринбург",
    "самара",
    "ростов-на-дону",
    "краснодар",
    "воронеж",
    "уфа",
    "челябинск",
    "пермь",
    "волгоград",
    "саратов",
    "тюмень",
    "ярославль",
    "тула",
    "рязань",
    "тверь",
    "иваново",
    "калуга",
    "кострома",
    "белгород",
    "курск",
    "брянск",
    "липецк",
    "орел",
    "чебоксары",
    "йошкар-ола",
    "смоленск",
  ];

  const pick = (s: string) => CITIES.find((c) => s.includes(c)) || null;

  const ca = pick(x);
  const cb = pick(y);

  if (ca && cb) {
    const norm = (c: string) => c.replace("-", " ").trim();
    return norm(ca) === norm(cb) || (norm(ca).includes("санкт") && norm(cb).includes("санкт"));
  }

  return x === y;
}

function formatDurationRU(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.max(0, Math.round((s - h * 3600) / 60));
  if (h <= 0) return `${m} мин`;
  if (m <= 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

function pickSuggestions(value: string, routeType: RouteType) {
  const q = normalize(value);
  if (!q) return routeType === "airport" ? AIRPORT_HINTS.slice(0, 8) : POPULAR_CITIES.slice(0, 12);

  const source = routeType === "airport" ? [...AIRPORT_HINTS, ...POPULAR_CITIES] : POPULAR_CITIES;

  const scored = source
    .map((name) => {
      const n = normalize(name);
      const idx = n.indexOf(q);
      if (idx === -1) return null;
      const score = idx === 0 ? 100 : 50 - idx;
      return { name, score };
    })
    .filter(Boolean) as Array<{ name: string; score: number }>;

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map((x) => x.name);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDatetimeLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function addMinutes(base: Date, minutes: number) {
  const d = new Date(base.getTime());
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function setTimeSameDay(base: Date, hh: number, mm: number) {
  const d = new Date(base.getTime());
  d.setHours(hh, mm, 0, 0);
  return d;
}

function normalizePhoneLive(input: string) {
  let v = input;

  if (v.startsWith("+8")) v = "+7" + v.slice(2);
  else if (v.startsWith("8")) v = "+7" + v.slice(1);
  else if (v.startsWith("7")) v = "+7" + v.slice(1);
  else if (v.startsWith("9")) v = "+7" + v;

  return v;
}

function IconPlane() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 19l20-7-20-7 5 7-5 7Z" />
      <path d="M7 12h15" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 16l1.4-5A2 2 0 0 1 8.3 9h7.4a2 2 0 0 1 1.9 2L19 16" />
      <path d="M3 16h18" />
      <circle cx="7" cy="17" r="1.7" />
      <circle cx="17" cy="17" r="1.7" />
    </svg>
  );
}

function IconCity() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18" />
      <path d="M5 21V9l6-3v15" />
      <path d="M11 21V4l8 3v14" />
      <path d="M8 12h.01M8 15h.01M14 10h.01M14 13h.01M14 16h.01M17 10h.01M17 13h.01M17 16h.01" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconSwap() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h11" />
      <path d="m14 4 4 3-4 3" />
      <path d="M17 17H6" />
      <path d="m10 14-4 3 4 3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconUserCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20a6 6 0 0 1 12 0" />
      <path d="m17 10 1.5 1.5L21 9" />
    </svg>
  );
}

function IconFast() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </svg>
  );
}

function TypeTab({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 items-center justify-center gap-2 rounded-2xl px-4 text-base font-extrabold transition",
        active
          ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.28)]"
          : "bg-transparent text-zinc-700 hover:bg-white/70"
      )}
      aria-pressed={active ? "true" : "false"}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function CarClassCard({
  active,
  title,
  price,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  price: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-3 text-left transition",
        active
          ? "border-blue-200 bg-blue-50 shadow-[0_10px_25px_rgba(37,99,235,0.12)]"
          : "border-zinc-200 bg-white hover:border-blue-100 hover:bg-zinc-50"
      )}
    >
      <div className={cn("text-sm font-bold", active ? "text-blue-700" : "text-zinc-800")}>{title}</div>
      <div className={cn("mt-1 text-[13px] font-extrabold", active ? "text-blue-700" : "text-zinc-900")}>{price}</div>
      {subtitle ? <div className="mt-1 text-xs text-zinc-500">{subtitle}</div> : null}
    </button>
  );
}

export default function LeadForm({
  carClass,
  onCarClassChange,
  routeType,
  onRouteTypeChange,
  initialFrom,
  initialTo,
}: {
  carClass: CarClass;
  onCarClassChange: (v: CarClass) => void;
  routeType: RouteType;
  onRouteTypeChange: (v: RouteType) => void;
  initialFrom?: string;
  initialTo?: string;
}) {
  const router = useRouter();

  const ids = useMemo(
    () => ({
      name: "lead-name",
      phone: "lead-phone",
      from: "lead-from",
      to: "lead-to",
      datetime: "lead-datetime",
      roundTrip: "lead-round-trip",
      comment: "lead-comment",
    }),
    []
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromText, setFromText] = useState(initialFrom ?? "");
  const [toText, setToText] = useState(initialTo ?? "");
  const [fromPlaceId, setFromPlaceId] = useState<string | null>(null);
  const [toPlaceId, setToPlaceId] = useState<string | null>(null);
  const [datetimeLocal, setDatetimeLocal] = useState<string>("");

  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [km, setKm] = useState<number | null>(null);
  const [travelSeconds, setTravelSeconds] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const fromSuggestions = useMemo(() => pickSuggestions(fromText, routeType), [fromText, routeType]);
  const toSuggestions = useMemo(() => pickSuggestions(toText, routeType), [toText, routeType]);

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const fromBoxRef = useRef<HTMLDivElement | null>(null);
  const toBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (fromBoxRef.current && !fromBoxRef.current.contains(t)) setFromOpen(false);
      if (toBoxRef.current && !toBoxRef.current.contains(t)) setToOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const a = normalize(fromText);
    const b = normalize(toText);
    if (!a || !b) return;

    const fromIsAirport = looksLikeAirport(fromText);
    const toIsAirport = looksLikeAirport(toText);

    if (fromIsAirport || toIsAirport) {
      if (routeType !== "airport") onRouteTypeChange("airport");
      return;
    }

    if (sameCity(fromText, toText)) {
      if (routeType !== "city") onRouteTypeChange("city");
      return;
    }

    if (routeType !== "intercity") onRouteTypeChange("intercity");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromText, toText]);

  const canSubmit = useMemo(() => {
    return name.trim() && phone.trim() && fromText.trim() && toText.trim();
  }, [name, phone, fromText, toText]);

  function applyQuickTime(kind: "plus1" | "plus2" | "today18" | "tomorrow10") {
    const now = new Date();
    let d = now;

    if (kind === "plus1") d = addMinutes(now, 60);
    if (kind === "plus2") d = addMinutes(now, 120);
    if (kind === "today18") d = setTimeSameDay(now, 18, 0);
    if (kind === "tomorrow10") {
      const t = new Date(now.getTime());
      t.setDate(t.getDate() + 1);
      d = setTimeSameDay(t, 10, 0);
    }

    setDatetimeLocal(toDatetimeLocal(d));
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setCalcError(null);
      setKm(null);
      setTravelSeconds(null);

      if (routeType !== "intercity" && routeType !== "airport" && routeType !== "city") return;
      if (!fromText.trim() || !toText.trim()) return;

      setCalcLoading(true);

      try {
        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            from: fromText.trim(),
            to: toText.trim(),
            fromPlaceId,
            toPlaceId,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok || !data.ok) {
          setCalcError(data?.error || "Не удалось рассчитать расстояние");
          setKm(null);
          return;
        }

        setKm(Number(data.km) || null);
        setTravelSeconds(Number(data.seconds) || null);
      } catch (e: any) {
        if (cancelled) return;
        if (e?.name === "AbortError") return;
        setCalcError("Не удалось рассчитать расстояние");
        setKm(null);
        setTravelSeconds(null);
      } finally {
        if (!cancelled) setCalcLoading(false);
      }
    }

    const t = setTimeout(run, 450);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(t);
    };
  }, [routeType, fromText, toText, fromPlaceId, toPlaceId]);

  const pricesByClass = useMemo(() => {
    const calcFor = (klass: CarClass) => {
      if (routeType === "city") return CITY_BASE_PRICE[klass];
      if (!km) return null;

      if (routeType === "city") {
        const perKm = PER_KM[klass] + CITY_PER_KM_ADD;
        const base = Math.round(km * perKm);
        return CITY_LANDING_FEE + base;
      }

      let base = Math.round(km * PER_KM[klass]);
      if (roundTrip) base *= 2;

      let surcharge = 0;
      if (routeType === "airport") {
        const fromIsAirport = looksLikeAirport(fromText);
        const toIsAirport = looksLikeAirport(toText);
        const inMskSpb = isMskOrSpb(fromText) || isMskOrSpb(toText);

        if (inMskSpb) {
          surcharge = AIRPORT_SURCHARGE_MSK_SPB;
        } else {
          if (fromIsAirport && !toIsAirport) surcharge = AIRPORT_PICKUP_SURCHARGE;
          else if (!fromIsAirport && toIsAirport) surcharge = AIRPORT_DROPOFF_SURCHARGE;
          else surcharge = AIRPORT_DROPOFF_SURCHARGE;
        }

        if (roundTrip) surcharge *= 2;
      }

      return Math.max(MIN_INTERCITY_PRICE, base + surcharge);
    };

    return {
      standard: calcFor("standard"),
      comfort: calcFor("comfort"),
      business: calcFor("business"),
      minivan: calcFor("minivan"),
    };
  }, [routeType, km, roundTrip, fromText, toText]);

  const finalPrice = pricesByClass[carClass];

  const travelTimeText = useMemo(() => {
    if (travelSeconds == null || !Number.isFinite(travelSeconds)) return null;
    if (travelSeconds <= 0) return null;
    return formatDurationRU(travelSeconds);
  }, [travelSeconds]);

  function swapPlaces() {
    setFromText(toText);
    setToText(fromText);
    setFromPlaceId(toPlaceId);
    setToPlaceId(fromPlaceId);
    setFromOpen(false);
    setToOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }

    setLoading(true);
    try {
      const calcNote =
        (routeType === "intercity" || routeType === "airport" || routeType === "city") && finalPrice
          ? `\n\n[Авторасчёт]${roundTrip ? " туда-обратно" : ""}${travelTimeText ? ` (~${travelTimeText})` : ""}: ${formatRub(
              finalPrice
            )}`
          : "";

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        fromText: fromText.trim(),
        toText: toText.trim(),
        datetime: datetimeLocal ? datetimeLocal : null,
        carClass,
        roundTrip,
        comment: (comment.trim() ? comment.trim() : "") + calcNote || null,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка отправки");

      router.push("/thanks");
    } catch (e: any) {
      setError(e?.message || "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  const tripTitle =
    fromText.trim() && toText.trim()
      ? `${fromText.trim()} → ${toText.trim()}`
      : routeType === "airport"
      ? "Аэропорт → Город"
      : routeType === "city"
      ? "Поездка по городу"
      : "Межгородний маршрут";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-[28px] bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5 sm:p-6">
        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-2 rounded-[26px] bg-zinc-50 p-2">
            <TypeTab
              active={routeType === "airport"}
              label="Аэропорт"
              icon={<IconPlane />}
              onClick={() => onRouteTypeChange("airport")}
            />
            <TypeTab
              active={routeType === "intercity"}
              label="Межгород"
              icon={<IconCar />}
              onClick={() => onRouteTypeChange("intercity")}
            />
            <TypeTab active={routeType === "city"} label="Город" icon={<IconCity />} onClick={() => onRouteTypeChange("city")} />
          </div>

          <div className="grid gap-4">
            <div ref={fromBoxRef} className="relative">
              <label htmlFor={ids.from} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
                Откуда
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <IconPin />
                </div>
                <GooglePlacesInput
                  id={ids.from}
                  className="h-16 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-lg text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                  value={fromText}
                  onValueChange={(v) => {
                    setFromText(v);
                    setFromPlaceId(null);
                    setFromOpen(true);
                  }}
                  onPlacePick={({ placeId, address }) => {
                    setFromText(address);
                    setFromPlaceId(placeId);
                    setFromOpen(false);
                  }}
                  placeholder="Город, адрес, аэропорт"
                />
              </div>

              {fromOpen && fromSuggestions.length > 0 ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                  {fromSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="block w-full px-4 py-3 text-left text-sm text-zinc-800 transition hover:bg-blue-50"
                      onClick={() => {
                        setFromText(s);
                        setFromPlaceId(null);
                        setFromOpen(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={swapPlaces}
                  className="grid h-14 w-14 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-lg transition hover:scale-[1.03] hover:text-blue-600"
                  aria-label="Поменять местами точки маршрута"
                >
                  <IconSwap />
                </button>
              </div>

              <div ref={toBoxRef} className="relative">
                <label htmlFor={ids.to} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
                  Куда
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <IconPin />
                  </div>
                  <GooglePlacesInput
                    id={ids.to}
                    className="h-16 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-lg text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                    value={toText}
                    onValueChange={(v) => {
                      setToText(v);
                      setToPlaceId(null);
                      setToOpen(true);
                    }}
                    onPlacePick={({ placeId, address }) => {
                      setToText(address);
                      setToPlaceId(placeId);
                      setToOpen(false);
                    }}
                    placeholder="Город, адрес, аэропорт"
                  />
                </div>

                {toOpen && toSuggestions.length > 0 ? (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                    {toSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="block w-full px-4 py-3 text-left text-sm text-zinc-800 transition hover:bg-blue-50"
                        onClick={() => {
                          setToText(s);
                          setToPlaceId(null);
                          setToOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-xl font-extrabold text-white shadow-[0_16px_40px_rgba(37,99,235,0.28)] transition hover:opacity-95"
            >
              <span>Рассчитать маршрут</span>
              <span className="shrink-0">
                <IconPlane />
              </span>
            </button>
          </div>

          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50/70 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
              <div>
                <div className="text-[18px] font-extrabold text-zinc-900">{tripTitle}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-zinc-600">
                  {calcLoading ? (
                    <span>Считаем маршрут…</span>
                  ) : calcError ? (
                    <span className="text-rose-600">{calcError}</span>
                  ) : (
                    <>
                      {km ? <span className="font-semibold text-orange-500">~ {Math.round(km)} км</span> : null}
                      {km && travelTimeText ? <span>•</span> : null}
                      {travelTimeText ? <span>~ {travelTimeText}</span> : null}
                      {!km && routeType === "city" ? <span>{formatFrom(CITY_BASE_PRICE[carClass])}</span> : null}
                    </>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-[17px] font-semibold text-zinc-600">{routeType === "city" ? "от" : "цена"}</div>
                <div className="text-[24px] font-black text-zinc-950">
                  {finalPrice ? formatRub(finalPrice) : routeType === "city" ? formatFrom(CITY_BASE_PRICE[carClass]) : "—"}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600 md:justify-end">
                  <IconCar />
                  <span>
                    {carClass === "standard"
                      ? "Стандарт"
                      : carClass === "comfort"
                      ? "Комфорт"
                      : carClass === "business"
                      ? "Бизнес"
                      : "Минивен"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CarClassCard
                active={carClass === "standard"}
                title="Стандарт"
                price={pricesByClass.standard ? formatRub(pricesByClass.standard) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.standard) : "—"}
                onClick={() => onCarClassChange("standard")}
              />
              <CarClassCard
                active={carClass === "comfort"}
                title="Комфорт"
                price={pricesByClass.comfort ? formatRub(pricesByClass.comfort) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.comfort) : "—"}
                onClick={() => onCarClassChange("comfort")}
              />
              <CarClassCard
                active={carClass === "business"}
                title="Бизнес"
                price={pricesByClass.business ? formatRub(pricesByClass.business) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.business) : "—"}
                onClick={() => onCarClassChange("business")}
              />
              <CarClassCard
                active={carClass === "minivan"}
                title="Минивен"
                price={pricesByClass.minivan ? formatRub(pricesByClass.minivan) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.minivan) : "—"}
                onClick={() => onCarClassChange("minivan")}
              />
            </div>
          </div>

          <div>
            <label htmlFor={ids.datetime} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
              Дата и время
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <IconCalendar />
              </div>
              <input
                id={ids.datetime}
                className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-base text-zinc-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                type="datetime-local"
                value={datetimeLocal}
                onChange={(e) => setDatetimeLocal(e.target.value)}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyQuickTime("plus1")}
                className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                Через 1 час
              </button>
              <button
                type="button"
                onClick={() => applyQuickTime("today18")}
                className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                Сегодня 18:00
              </button>
              <button
                type="button"
                onClick={() => applyQuickTime("tomorrow10")}
                className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
              >
                Завтра 10:00
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={ids.name} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
                Ваше имя
              </label>
              <input
                id={ids.name}
                className="h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor={ids.phone} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
                Телефон
              </label>
              <input
                id={ids.phone}
                className="h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                value={phone}
                onChange={(e) => setPhone(normalizePhoneLive(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label htmlFor={ids.comment} className="mb-2 block text-[15px] font-extrabold text-zinc-900">
              Комментарий
            </label>
            <textarea
              id={ids.comment}
              className="min-h-[96px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Детское кресло, багаж, рейс..."
            />
          </div>

          <div className="flex items-center justify-end">
            <label
              htmlFor={ids.roundTrip}
              className="inline-flex cursor-pointer items-center gap-3 text-xl font-bold text-zinc-800"
            >
              <input
                id={ids.roundTrip}
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="h-6 w-6 rounded-md border-zinc-300 accent-blue-600"
              />
              Туда-обратно
            </label>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div>
          ) : null}

          <button
            disabled={loading || !canSubmit}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-xl font-extrabold text-white shadow-[0_16px_40px_rgba(37,99,235,0.28)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? "Отправляем…" : "Оформить заказ"}</span>
            <span className="shrink-0">
              <IconArrowRight />
            </span>
          </button>

          <div className="text-[12px] leading-5 text-zinc-500">
            Нажимая «Оформить заказ», вы соглашаетесь с{" "}
            <a href="/privacy" className="text-zinc-700 underline decoration-zinc-300 hover:text-zinc-900">
              политикой конфиденциальности
            </a>{" "}
            и{" "}
            <a href="/personal-data" className="text-zinc-700 underline decoration-zinc-300 hover:text-zinc-900">
              обработкой персональных данных
            </a>
            .
          </div>
        </div>
      </div>

      <aside className="grid gap-4">
        <div className="rounded-[28px] bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <div className="text-[20px] font-black text-zinc-900">Популярные маршруты</div>
          <div className="mt-4 grid gap-3">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                type="button"
                onClick={() => {
                  setFromText(route.from);
                  setToText(route.to);
                  setFromPlaceId(null);
                  setToPlaceId(null);
                  setFromOpen(false);
                  setToOpen(false);
                }}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition hover:border-blue-100 hover:bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">{route.icon}</div>
                  <div className="text-[18px] font-bold leading-7 text-zinc-800">
                    <div>{route.from}</div>
                    <div>→ {route.to}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <div className="grid gap-8 text-center">
            <div className="grid justify-items-center gap-3 text-blue-600">
              <IconShield />
              <div className="text-[18px] font-black leading-7 text-zinc-900">Фиксированная цена</div>
            </div>

            <div className="grid justify-items-center gap-3 text-blue-600">
              <IconUserCheck />
              <div className="text-[18px] font-black leading-7 text-zinc-900">Водители с опытом</div>
            </div>

            <div className="grid justify-items-center gap-3 text-blue-600">
              <IconFast />
              <div className="text-[18px] font-black leading-7 text-zinc-900">Быстрая подача</div>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}