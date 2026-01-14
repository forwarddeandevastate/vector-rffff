"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-2">
        <div className="text-xs font-semibold text-zinc-700">{label}</div>
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
  standard: 30,
  comfort: 37,
  minivan: 52,
  business: 65,
};

// --- Подсказки мест (для удобства, но НЕ обязательно выбирать из списка — можно вводить руками) ---
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

export default function LeadForm({
  carClass,
  onCarClassChange,
  routeType,
  onRouteTypeChange,
}: {
  carClass: CarClass;
  onCarClassChange: (v: CarClass) => void;
  routeType: RouteType;
  onRouteTypeChange: (v: RouteType) => void;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [datetimeLocal, setDatetimeLocal] = useState<string>("");

  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // авто-расчёт
  const [km, setKm] = useState<number | null>(null);
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

  // Авто-расчёт км только для межгорода, с debounce
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setCalcError(null);
      setKm(null);

      if (routeType !== "intercity") return;
      if (!fromText.trim() || !toText.trim()) return;

      setCalcLoading(true);

      try {
        const url =
          `/api/distance?from=${encodeURIComponent(fromText.trim())}` +
          `&to=${encodeURIComponent(toText.trim())}`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok || !data.ok) {
          setCalcError(data?.error || "Не удалось рассчитать расстояние");
          setKm(null);
          return;
        }

        setKm(Number(data.km) || null);
      } catch (e: any) {
        if (cancelled) return;
        if (e?.name === "AbortError") return;
        setCalcError("Не удалось рассчитать расстояние");
        setKm(null);
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
  }, [routeType, fromText, toText]);

  const finalPrice = useMemo(() => {
    if (routeType !== "intercity") return null;
    if (!km) return null;
    let price = Math.round(km * PER_KM[carClass]);
    if (roundTrip) price *= 2;
    return price;
  }, [routeType, km, carClass, roundTrip]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }

    setLoading(true);
    try {
      // Если межгород — добавим расчёт в комментарий (БД не трогаем)
      const calcNote =
        routeType === "intercity" && km && finalPrice
          ? `\n\n[Авторасчёт] ${km} км · ${PER_KM[carClass]} ₽/км${roundTrip ? " · туда-обратно" : ""} = ${formatRub(
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
      {/* Тип поездки + итоговая стоимость (только итог, без ориентиров) */}
      <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-zinc-700">Тип поездки</div>

            <div className="mt-2 flex flex-wrap gap-2">
              <SegButton active={routeType === "city"} onClick={() => onRouteTypeChange("city")}>
                Город
              </SegButton>
              <SegButton active={routeType === "airport"} onClick={() => onRouteTypeChange("airport")}>
                Аэропорт
              </SegButton>
              <SegButton active={routeType === "intercity"} onClick={() => onRouteTypeChange("intercity")}>
                Межгород
              </SegButton>
            </div>

            {routeType === "intercity" ? (
              <div className="mt-3 rounded-xl border border-sky-200/70 bg-sky-50/60 px-3 py-2">
                <div className="text-[11px] font-semibold text-sky-900">Итоговая стоимость (авторасчёт)</div>

                {calcLoading ? (
                  <div className="mt-1 text-[11px] text-zinc-700">Считаем маршрут…</div>
                ) : calcError ? (
                  <div className="mt-1 text-[11px] text-rose-700">{calcError}</div>
                ) : finalPrice ? (
                  <>
                    <div className="mt-0.5 text-sm font-extrabold text-zinc-900">{formatRub(finalPrice)}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-600">
                      {km} км · {PER_KM[carClass]} ₽/км{roundTrip ? " · туда-обратно" : ""}
                    </div>
                  </>
                ) : (
                  <div className="mt-1 text-[11px] text-zinc-700">Введите “Откуда” и “Куда” — посчитаем автоматически.</div>
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
        <Field label="Ваше имя *" hint="Как к вам обращаться">
          <input className={ControlBase()} value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" />
        </Field>

        <Field label="Телефон *" hint="Для связи">
          <input
            className={ControlBase()}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 999 123-45-67"
            inputMode="tel"
          />
        </Field>

        {/* ОТКУДА */}
        <Field
          label="Откуда *"
          hint={routeType === "airport" ? "Можно выбрать аэропорт" : "Город / адрес (можно вводить руками)"}
          className="sm:col-span-2"
        >
          <div ref={fromBoxRef} className="relative">
            <input
              className={ControlBase()}
              value={fromText}
              onChange={(e) => {
                setFromText(e.target.value);
                setFromOpen(true);
              }}
              onFocus={() => setFromOpen(true)}
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
        >
          <div ref={toBoxRef} className="relative">
            <input
              className={ControlBase()}
              value={toText}
              onChange={(e) => {
                setToText(e.target.value);
                setToOpen(true);
              }}
              onFocus={() => setToOpen(true)}
              placeholder={
                routeType === "airport" ? "Например: Домодедово (DME) или Санкт-Петербург" : "Например: Санкт-Петербург"
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
        <Field label="Дата и время" hint="Можно выбрать быстро" className="sm:col-span-2">
          <div className="grid gap-2">
            <input
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

        <Field label="Класс авто">
          <select className={ControlBase()} value={carClass} onChange={(e) => onCarClassChange(e.target.value as CarClass)}>
            <option value="standard">Стандарт</option>
            <option value="comfort">Комфорт</option>
            <option value="business">Бизнес</option>
            <option value="minivan">Минивэн</option>
          </select>
        </Field>

        <Field label="Опции">
          <label className={cn(ControlBase("flex items-center gap-2"), "text-zinc-800")}>
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            Туда-обратно
          </label>
        </Field>

        <Field label="Комментарий" hint="Багаж, кресло, рейс" className="sm:col-span-2">
          <textarea
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
    </form>
  );
}
