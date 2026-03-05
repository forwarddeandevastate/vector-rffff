"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GooglePlacesInput from "@/app/ui/google-places-input";

export type CarClass = "standard" | "comfort" | "business" | "minivan";
export type RouteType = "city" | "airport" | "intercity";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function ControlBase(className?: string) {
  return cn(
    "h-11 w-full rounded-xl border border-zinc-200 bg-white/90 px-3 text-sm outline-none",
    "shadow-[0_1px_0_rgba(16,24,40,0.04)]",
    "focus:border-sky-300 focus:ring-2 focus:ring-sky-100",
    className
  );
}

function Field({
  label,
  hint,
  children,
  className,
  labelFor,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  labelFor?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-2">
        {labelFor ? (
          <label htmlFor={labelFor} className="text-xs font-semibold text-zinc-700">
            {label}
          </label>
        ) : (
          <div className="text-xs font-semibold text-zinc-700">{label}</div>
        )}
        {hint ? <div className="text-[11px] text-zinc-500">{hint}</div> : null}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SegButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-xl px-3 text-sm font-semibold transition",
        "border shadow-[0_1px_0_rgba(16,24,40,0.04)]",
        active
          ? "border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-100"
          : "border-zinc-200 bg-white/85 text-zinc-800 hover:bg-white"
      )}
      aria-pressed={active ? "true" : "false"}
    >
      {children}
    </button>
  );
}

function formatRub(n: number) {
  const s = String(n);
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(s.slice(start, i));
  }
  return `${parts.join(" ")} ₽`;
}

// тариф ₽/км по классу
const PER_KM: Record<CarClass, number> = {
  standard: 31,
  comfort: 46,
  minivan: 55,
  business: 80,
};

// Город: посадка и небольшой коэффициент к тарифам (чтобы город был чуть дороже межгорода)
const CITY_LANDING_FEE = 500;
const CITY_PER_KM_ADD = 5;

// Аэропорт: для Москвы/СПб фиксированная наценка, для остальных — как раньше (700/800)
const AIRPORT_SURCHARGE_MSK_SPB = 1000;


// Минимальная стоимость для межгорода/аэропорта
const MIN_INTERCITY_PRICE = 1500;

// Наценки для аэропорта (к межгородному тарифу)
const AIRPORT_PICKUP_SURCHARGE = 800; // забрать из аэропорта
const AIRPORT_DROPOFF_SURCHARGE = 700; // отвезти в аэропорт

function looksLikeAirport(s: string) {
  const v = normalize(s);
  if (!v) return false;
  if (v.includes("аэроп")) return true;
  // Частые названия аэропортов (в адресах Google часто нет слова "аэропорт")
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
  // IATA в скобках
  if (/\b(svo|dme|vko|led|aer|svx|ovb|kuf|kzn|krr|kgd)\b/i.test(s)) return true;
  // популярные подсказки
  return AIRPORT_HINTS.some((x) => {
    const nx = normalize(x);
    // точное совпадение или вхождение части названия ("Пулково" внутри адреса)
    if (nx === v) return true;
    const baseName = nx.replace(/\s*\([^)]*\)\s*/g, "").trim();
    return baseName && v.includes(baseName);
  });
}

function isMskOrSpb(s: string) {
  const v = normalize(s);
  if (!v) return false;
  // Москва
  if (v.includes("москва") || v.includes("moscow")) return true;
  // Санкт‑Петербург / СПб
  if (v.includes("санкт") || v.includes("петербург") || v.includes("спб") || v.includes("saint petersburg") || v.includes("st petersburg")) return true;
  return false;
}

function sameCity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return false;

  // Пытаемся определить город по вхождению названия в адрес
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
    // "санкт-петербург" и "санкт петербург" считаем одним городом
    const norm = (c: string) => c.replace("-", " ").trim();
    return norm(ca) === norm(cb) || (norm(ca).includes("санкт") && norm(cb).includes("санкт"));
  }

  // fallback: если явно одинаковые строки (или очень похожи)
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

// ====== БАЗОВЫЕ ЦЕНЫ ДЛЯ ФОРМЫ (НЕ ФИНАЛ) ======
const CITY_BASE_PRICE: Record<CarClass, number> = {
  standard: 1000,
  comfort: 1500,
  business: 3000,
  minivan: 3500,
};

function airportPriceFromCity(cityPrice: number) {
  return Math.round(cityPrice * 1.1);
}

function formatFrom(n: number) {
  return `от ${n.toLocaleString("ru-RU")} ₽`;
}

// --- Подсказки мест (можно вводить руками) ---
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

function normalize(s: string) {
  return s.trim().toLowerCase();
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

// --- Дата/время helpers ---
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

/**
 * ✅ Правка телефона (РФ)
 * - 8xxxxxxxxxx -> +7xxxxxxxxxx
 * - 7xxxxxxxxxx -> +7xxxxxxxxxx
 * - +8xxxxxxxxxx -> +7xxxxxxxxxx
 * - 9xxxxxxxxxx -> +79xxxxxxxxxx   ✅ ДОБАВИЛИ
 * Остальное не трогаем.
 */
function normalizePhoneLive(input: string) {
  let v = input;

  if (v.startsWith("+8")) v = "+7" + v.slice(2);
  else if (v.startsWith("8")) v = "+7" + v.slice(1);
  else if (v.startsWith("7")) v = "+7" + v.slice(1);
  else if (v.startsWith("9")) v = "+7" + v; // ✅ единственная правка

  return v;
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

  // ✅ ids для связки label -> input/select (исправляет Lighthouse)
  const ids = useMemo(
    () => ({
      name: "lead-name",
      phone: "lead-phone",
      from: "lead-from",
      to: "lead-to",
      datetime: "lead-datetime",
      carClass: "lead-car-class",
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

  // авто-расчёт
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

  // ✅ авто-переключение типа поездки по введённым точкам
  useEffect(() => {
    const a = normalize(fromText);
    const b = normalize(toText);
    if (!a || !b) return;

    const fromIsAirport = looksLikeAirport(fromText);
    const toIsAirport = looksLikeAirport(toText);

    // 1) если где-то аэропорт — это всегда "Аэропорт"
    if (fromIsAirport || toIsAirport) {
      if (routeType !== "airport") onRouteTypeChange("airport");
      return;
    }

    // 2) если точки в одном городе — "Город"
    if (sameCity(fromText, toText)) {
      if (routeType !== "city") onRouteTypeChange("city");
      return;
    }

    // 3) иначе — межгород
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

  // Авто-расчёт км/времени для межгорода и аэропорта, с debounce
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

  const finalPrice = useMemo(() => {
    // Цена считаем для межгорода / аэропорта / города (если удалось получить км)
    if (routeType !== "intercity" && routeType !== "airport" && routeType !== "city") return null;
    if (!km) return null;

    // Город: посадка 500 + тариф как межгород, но +5 ₽/км
    if (routeType === "city") {
      const perKm = PER_KM[carClass] + CITY_PER_KM_ADD;
      const base = Math.round(km * perKm);
      const total = CITY_LANDING_FEE + base;
      return total;
    }

    // Межгород / Аэропорт: базовая часть по тарифу
    let base = Math.round(km * PER_KM[carClass]);
    if (roundTrip) base *= 2;

    // Аэропорт: Москва/СПб фикс 1000, остальные — 700/800 по направлению
    let surcharge = 0;
    if (routeType === "airport") {
      const fromIsAirport = looksLikeAirport(fromText);
      const toIsAirport = looksLikeAirport(toText);

      const inMskSpb = isMskOrSpb(fromText) || isMskOrSpb(toText);

      if (inMskSpb) {
        surcharge = AIRPORT_SURCHARGE_MSK_SPB;
      } else {
        if (fromIsAirport && !toIsAirport) surcharge = AIRPORT_PICKUP_SURCHARGE; // из аэропорта
        else if (!fromIsAirport && toIsAirport) surcharge = AIRPORT_DROPOFF_SURCHARGE; // в аэропорт
        else surcharge = AIRPORT_DROPOFF_SURCHARGE;
      }

      if (roundTrip) surcharge *= 2;
    }

    const total = base + surcharge;
    return Math.max(MIN_INTERCITY_PRICE, total);
  }, [routeType, km, carClass, roundTrip, fromText, toText]);

  const travelTimeText = useMemo(() => {
    if (travelSeconds == null || !Number.isFinite(travelSeconds)) return null;
    if (travelSeconds <= 0) return null;
    return formatDurationRU(travelSeconds);
  }, [travelSeconds]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }

    setLoading(true);
    try {
      // ✅ СКРЫЛИ ВНУТРЕННИЕ ДЕТАЛИ: только итог (без ₽/км и без км)
      const calcNote =
        (routeType === "intercity" || routeType === "airport") && finalPrice
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

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {/* Тип поездки + итоговая стоимость */}
      <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-zinc-700">Тип поездки</div>

            {/* Базовая цена только для города */}
            {routeType === "city" && (
              <div className="mt-2 text-sm font-extrabold text-zinc-900">{formatFrom(CITY_BASE_PRICE[carClass])}</div>
            )}

            {/* ✅ ПОРЯДОК: Межгород → Аэропорт → Город */}
            <div className="mt-2 flex flex-wrap gap-2">
              <SegButton active={routeType === "intercity"} onClick={() => onRouteTypeChange("intercity")}>
                Межгород
              </SegButton>
              <SegButton active={routeType === "airport"} onClick={() => onRouteTypeChange("airport")}>
                Аэропорт
              </SegButton>
              <SegButton active={routeType === "city"} onClick={() => onRouteTypeChange("city")}>
                Город
              </SegButton>
            </div>

            {routeType === "intercity" || routeType === "airport" || routeType === "city" ? (
              <div className="mt-3 rounded-xl border border-sky-200/70 bg-sky-50/60 px-3 py-2">
                <div className="text-[11px] font-semibold text-sky-900">Итоговая стоимость (авторасчёт)</div>

                {calcLoading ? (
                  <div className="mt-1 text-[11px] text-zinc-700">Считаем маршрут…</div>
                ) : calcError ? (
                  <div className="mt-1 text-[11px] text-rose-700">{calcError}</div>
                ) : finalPrice ? (
                  <>
                    <div className="mt-0.5 text-sm font-extrabold text-zinc-900">{formatRub(finalPrice)}</div>
                    {travelTimeText ? (
                      <div className="mt-0.5 text-[11px] text-zinc-600">Время в пути: ~{travelTimeText}</div>
                    ) : null}
                    {roundTrip ? <div className="mt-0.5 text-[11px] text-zinc-600">Туда-обратно</div> : null}
                  </>
                ) : (
                  <div className="mt-1 text-[11px] text-zinc-700">
                    Введите “Откуда” и “Куда” — посчитаем автоматически.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ваше имя *" hint="Как к вам обращаться" labelFor={ids.name}>
          <input
            id={ids.name}
            className={ControlBase()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
            autoComplete="name"
          />
        </Field>

        <Field label="Телефон *" labelFor={ids.phone}>
          <input
            id={ids.phone}
            className={ControlBase()}
            value={phone}
            onChange={(e) => setPhone(normalizePhoneLive(e.target.value))}
            placeholder="+7 999 123-45-67"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>

        {/* ОТКУДА */}
        <Field
          label="Откуда *"
          hint={routeType === "airport" ? "Можно выбрать аэропорт" : "Город / адрес (можно вводить руками)"}
          className="sm:col-span-2"
          labelFor={ids.from}
        >
          <div ref={fromBoxRef} className="relative">
            <GooglePlacesInput
              id={ids.from}
              className={ControlBase()}
              value={fromText}
              onValueChange={(v) => {
                setFromText(v);
                setFromPlaceId(null);
                setFromOpen(false);
              }}
              onPlacePick={({ placeId, address }) => {
                setFromText(address);
                setFromPlaceId(placeId);
                setFromOpen(false);
              }}
              placeholder={routeType === "airport" ? "Например: Шереметьево (SVO) или Москва" : "Например: Москва"}
            />
            {fromOpen && fromSuggestions.length > 0 ? (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                {fromSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-zinc-800 hover:bg-sky-50"
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
        </Field>

        {/* КУДА */}
        <Field
          label="Куда *"
          hint={routeType === "airport" ? "Можно выбрать аэропорт" : "Город / адрес (можно вводить руками)"}
          className="sm:col-span-2"
          labelFor={ids.to}
        >
          <div ref={toBoxRef} className="relative">
            <GooglePlacesInput
              id={ids.to}
              className={ControlBase()}
              value={toText}
              onValueChange={(v) => {
                setToText(v);
                setToPlaceId(null);
                setToOpen(false);
              }}
              onPlacePick={({ placeId, address }) => {
                setToText(address);
                setToPlaceId(placeId);
                setToOpen(false);
              }}
              placeholder={
                routeType === "airport"
                  ? "Например: Домодедово (DME) или Санкт-Петербург"
                  : "Например: Санкт-Петербург"
              }
            />
            {toOpen && toSuggestions.length > 0 ? (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                {toSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-zinc-800 hover:bg-sky-50"
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
        </Field>

        {/* Дата/время */}
        <Field label="Дата и время" hint="Можно выбрать быстро" className="sm:col-span-2" labelFor={ids.datetime}>
          <div className="grid gap-2">
            <input
              id={ids.datetime}
              className={ControlBase()}
              type="datetime-local"
              value={datetimeLocal}
              onChange={(e) => setDatetimeLocal(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyQuickTime("plus1")}
                className="h-9 rounded-xl border border-zinc-200 bg-white/85 px-3 text-xs font-semibold text-zinc-700 hover:bg-white"
              >
                Через 1 час
              </button>
              <button
                type="button"
                onClick={() => applyQuickTime("plus2")}
                className="h-9 rounded-xl border border-zinc-200 bg-white/85 px-3 text-xs font-semibold text-zinc-700 hover:bg-white"
              >
                Через 2 часа
              </button>
              <button
                type="button"
                onClick={() => applyQuickTime("today18")}
                className="h-9 rounded-xl border border-zinc-200 bg-white/85 px-3 text-xs font-semibold text-zinc-700 hover:bg-white"
              >
                Сегодня 18:00
              </button>
              <button
                type="button"
                onClick={() => applyQuickTime("tomorrow10")}
                className="h-9 rounded-xl border border-zinc-200 bg-white/85 px-3 text-xs font-semibold text-zinc-700 hover:bg-white"
              >
                Завтра 10:00
              </button>
            </div>
          </div>
        </Field>

        <Field label="Класс авто" labelFor={ids.carClass}>
          <select
            id={ids.carClass}
            className={ControlBase()}
            value={carClass}
            onChange={(e) => onCarClassChange(e.target.value as CarClass)}
          >
            <option value="standard">Стандарт</option>
            <option value="comfort">Комфорт</option>
            <option value="business">Бизнес</option>
            <option value="minivan">Минивэн</option>
          </select>
        </Field>

        <Field label="Опции">
          <label htmlFor={ids.roundTrip} className={cn(ControlBase("flex items-center gap-2"), "text-zinc-800")}>
            <input
              id={ids.roundTrip}
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            Туда-обратно
          </label>
        </Field>

        <Field label="Комментарий" hint="Багаж, кресло, рейс" className="sm:col-span-2" labelFor={ids.comment}>
          <textarea
            id={ids.comment}
            className={cn(
              "min-h-[96px] w-full rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm outline-none",
              "shadow-[0_1px_0_rgba(16,24,40,0.04)]",
              "focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            )}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: детское кресло, 2 чемодана, рейс SU123"
          />
        </Field>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">{error}</div>
      ) : null}

      <button
        disabled={loading || !canSubmit}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-extrabold text-white shadow-sm transition",
          "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {loading ? "Отправляем…" : "Отправить заявку"}
      </button>

      <div className="text-[11px] leading-5 text-zinc-500">
        Нажимая «Отправить заявку», вы соглашаетесь с{" "}
        <a href="/privacy" className="text-zinc-600 underline decoration-zinc-300 hover:text-zinc-900">
          политикой конфиденциальности
        </a>{" "}
        и{" "}
        <a href="/personal-data" className="text-zinc-600 underline decoration-zinc-300 hover:text-zinc-900">
          обработкой персональных данных
        </a>
        .
      </div>
    </form>
  );
}