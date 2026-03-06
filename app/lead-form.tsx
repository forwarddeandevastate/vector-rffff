"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={ControlBase(props.className)} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={ControlBase(props.className)} />;
}

function SegButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2 text-sm font-semibold transition",
        active
          ? "border-sky-200 bg-sky-50 text-sky-700"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      )}
    >
      {children}
    </button>
  );
}

function MiniButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50",
        props.className
      )}
    >
      {children}
    </button>
  );
}

function SuggestList({
  items,
  onPick,
}: {
  items: string[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      {items.slice(0, 6).map((x) => (
        <button
          key={x}
          type="button"
          className="block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50"
          onClick={() => onPick(x)}
        >
          {x}
        </button>
      ))}
    </div>
  );
}

function formatRub(n: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";
}

function formatFrom(n: number) {
  return `от ${formatRub(n)}`;
}

function normalizePhoneLive(input: string) {
  const s = input ?? "";
  const trimmed = s.trimStart();
  if (!trimmed) return "";
  if (trimmed.startsWith("+8")) return "+7" + trimmed.slice(2);
  if (trimmed.startsWith("8")) return "+7" + trimmed.slice(1);
  if (trimmed.startsWith("7")) return "+7" + trimmed.slice(1);
  return s;
}

function shortPlace(s: string) {
  const v = (s || "").trim();
  if (!v) return "";
  return v.split(",")[0]?.trim() || v;
}

function formatDurationRu(totalMinutes: number) {
  const m = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (!h) return `${mm} мин`;
  if (!mm) return `${h} ч`;
  return `${h} ч ${mm} мин`;
}

const CITY_BASE_PRICE: Record<CarClass, number> = {
  standard: 1000,
  comfort: 1500,
  business: 3000,
  minivan: 3500,
};

const PER_KM: Record<CarClass, number> = {
  standard: 30,
  comfort: 37,
  minivan: 55,
  business: 65,
};

function airportPriceFromCity(cityPrice: number) {
  return Math.round(cityPrice * 1.1);
}

export default function LeadForm() {
  const ids = useMemo(
    () => ({
      name: "lead_name",
      phone: "lead_phone",
      from: "lead_from",
      to: "lead_to",
      datetime: "lead_dt",
      carClass: "lead_class",
      roundTrip: "lead_roundtrip",
      comment: "lead_comment",
    }),
    []
  );

  const [routeType, setRouteType] = useState<RouteType>("intercity");
  const [carClass, setCarClass] = useState<CarClass>("comfort");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");

  const [comment, setComment] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);

  const [datetimeLocal, setDatetimeLocal] = useState("");

  // suggestions (простая локальная подсказка — как в твоей версии)
  const CITIES = useMemo(
    () => [
      "Москва",
      "Санкт-Петербург",
      "Казань",
      "Нижний Новгород",
      "Екатеринбург",
      "Самара",
      "Ростов-на-Дону",
      "Краснодар",
      "Воронеж",
      "Уфа",
    ],
    []
  );

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromBoxRef = useRef<HTMLDivElement | null>(null);
  const toBoxRef = useRef<HTMLDivElement | null>(null);

  const fromSuggestions = useMemo(() => {
    const q = fromText.trim().toLowerCase();
    if (!q) return [];
    return CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [fromText, CITIES]);

  const toSuggestions = useMemo(() => {
    const q = toText.trim().toLowerCase();
    if (!q) return [];
    return CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [toText, CITIES]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as any;
      if (fromBoxRef.current && !fromBoxRef.current.contains(t)) setFromOpen(false);
      if (toBoxRef.current && !toBoxRef.current.contains(t)) setToOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // авто-расчёт
  const [km, setKm] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const a = fromText.trim();
    const b = toText.trim();

    if (routeType !== "intercity") {
      setKm(null);
      setMinutes(null);
      setCalcError(null);
      setCalcLoading(false);
      return;
    }

    if (!a || !b) {
      setKm(null);
      setMinutes(null);
      setCalcError(null);
      setCalcLoading(false);
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setCalcLoading(true);
        setCalcError(null);
        setKm(null);
        setMinutes(null);

        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: a, to: b }),
          signal: ctrl.signal,
        });

        const data = (await res.json().catch(() => null)) as any;

        if (!res.ok || !data?.ok) {
          setCalcError(data?.error || "Не удалось рассчитать расстояние");
          setKm(null);
          setMinutes(null);
          return;
        }

        setKm(Number(data.km) || null);
        setMinutes(Number(data.minutes) || null);
      } catch (e: any) {
        if (cancelled) return;
        if (e?.name === "AbortError") return;
        setCalcError("Не удалось рассчитать расстояние");
        setKm(null);
        setMinutes(null);
      } finally {
        if (!cancelled) setCalcLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
      ctrl.abort();
    };
  }, [routeType, fromText, toText]);

  const finalPrice = useMemo(() => {
    if (routeType === "city") return null;
    if (routeType === "airport") return null;

    if (!km) return null;
    const oneWay = Math.round(km * PER_KM[carClass]);
    return roundTrip ? oneWay * 2 : oneWay;
  }, [routeType, km, carClass, roundTrip]);

  const intercityPrices = useMemo(() => {
    if (routeType !== "intercity") return null;
    if (!km) return null;
    const base: Record<CarClass, number> = {
      standard: Math.round(km * PER_KM.standard),
      comfort: Math.round(km * PER_KM.comfort),
      business: Math.round(km * PER_KM.business),
      minivan: Math.round(km * PER_KM.minivan),
    };
    if (!roundTrip) return base;
    return {
      standard: base.standard * 2,
      comfort: base.comfort * 2,
      business: base.business * 2,
      minivan: base.minivan * 2,
    };
  }, [routeType, km, roundTrip]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function applyQuickTime(kind: "plus1" | "today18" | "tomorrow10") {
    const now = new Date();
    let d = new Date(now);

    if (kind === "plus1") d = new Date(now.getTime() + 60 * 60 * 1000);
    if (kind === "today18") {
      d.setHours(18, 0, 0, 0);
      if (d.getTime() < now.getTime()) d = new Date(now.getTime() + 60 * 60 * 1000);
    }
    if (kind === "tomorrow10") {
      d = new Date(now);
      d.setDate(now.getDate() + 1);
      d.setHours(10, 0, 0, 0);
    }

    const pad = (x: number) => String(x).padStart(2, "0");
    const v =
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDatetimeLocal(v);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const n = name.trim();
    const p = phone.trim();
    const a = fromText.trim();
    const b = toText.trim();

    if (!n) return setError("Введите имя");
    if (!p) return setError("Введите телефон");
    if (!a) return setError("Введите «Откуда»");
    if (!b) return setError("Введите «Куда»");

    setLoading(true);
    try {
      const payload = {
        name: n,
        phone: p,
        routeType,
        carClass,
        from: a,
        to: b,
        datetime: datetimeLocal || null,
        comment: comment.trim() || null,
        roundTrip: routeType === "intercity" ? roundTrip : false,
        km: km ?? null,
        minutes: minutes ?? null,
        price: finalPrice ?? null,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Не удалось отправить заявку");

      setName("");
      setPhone("");
      setFromText("");
      setToText("");
      setComment("");
      setRoundTrip(false);
      setDatetimeLocal("");
    } catch (e: any) {
      setError(e?.message || "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Закажите трансфер
          </h2>
          <p className="mt-2 text-base text-zinc-600">Быстрый расчёт цены и времени в пути</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6"
          >
            <div className="flex flex-wrap gap-2">
              <SegButton active={routeType === "airport"} onClick={() => setRouteType("airport")}>
                ✈ Аэропорт
              </SegButton>
              <SegButton active={routeType === "intercity"} onClick={() => setRouteType("intercity")}>
                🚗 Межгород
              </SegButton>
              <SegButton active={routeType === "city"} onClick={() => setRouteType("city")}>
                🏙 Город
              </SegButton>
            </div>

            {/* Откуда / Куда + swap */}
            <div className="mt-5 grid gap-3">
              <div ref={fromBoxRef} className="relative">
                <label htmlFor={ids.from} className="mb-1 block text-sm font-semibold text-zinc-900">
                  Откуда
                </label>
                <TextInput
                  id={ids.from}
                  value={fromText}
                  onChange={(e) => {
                    setFromText(e.target.value);
                    setFromOpen(true);
                  }}
                  onFocus={() => setFromOpen(true)}
                  placeholder={routeType === "intercity" ? "Город" : "Город, адрес, аэропорт"}
                />
                {fromOpen && fromSuggestions.length > 0 && (
                  <SuggestList
                    items={fromSuggestions}
                    onPick={(v) => {
                      setFromText(v);
                      setFromOpen(false);
                    }}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Поменять местами"
                  className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm"
                  onClick={() => {
                    const a = fromText;
                    const b = toText;
                    setFromText(b);
                    setToText(a);
                  }}
                >
                  ⇄
                </button>

                <div ref={toBoxRef} className="relative">
                  <label htmlFor={ids.to} className="mb-1 block text-sm font-semibold text-zinc-900">
                    Куда
                  </label>
                  <TextInput
                    id={ids.to}
                    value={toText}
                    onChange={(e) => {
                      setToText(e.target.value);
                      setToOpen(true);
                    }}
                    onFocus={() => setToOpen(true)}
                    placeholder={routeType === "intercity" ? "Город" : "Город, адрес, аэропорт"}
                  />
                  {toOpen && toSuggestions.length > 0 && (
                    <SuggestList
                      items={toSuggestions}
                      onPick={(v) => {
                        setToText(v);
                        setToOpen(false);
                      }}
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 text-base font-semibold text-white shadow-sm hover:opacity-95"
                onClick={() => {
                  setFromOpen(false);
                  setToOpen(false);
                }}
              >
                Рассчитать маршрут ➜
              </button>
            </div>

            {/* Результат: межгород */}
            {routeType === "intercity" && (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-lg font-extrabold text-zinc-900">
                      {(shortPlace(fromText) || "Откуда") + " → " + (shortPlace(toText) || "Куда")}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {calcLoading
                        ? "Считаем…"
                        : calcError
                          ? calcError
                          : km
                            ? `~ ${km} км · ~ ${minutes ? formatDurationRu(minutes) : ""}`
                            : "Введите «Откуда» и «Куда» — рассчитаем автоматически"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-zinc-900">
                      {calcLoading ? "…" : finalPrice ? formatRub(finalPrice) : "—"}
                    </div>
                    <div className="text-sm font-semibold text-zinc-700">
                      {carClass === "standard" && "Стандарт"}
                      {carClass === "comfort" && "Комфорт"}
                      {carClass === "business" && "Бизнес"}
                      {carClass === "minivan" && "Минивэн"}
                    </div>
                  </div>
                </div>

                {intercityPrices && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-4">
                    {(
                      [
                        ["standard", "Стандарт"],
                        ["comfort", "Комфорт"],
                        ["business", "Бизнес"],
                        ["minivan", "Минивэн"],
                      ] as const
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setCarClass(k)}
                        className={cn(
                          "rounded-2xl border px-3 py-3 text-left shadow-sm",
                          carClass === k
                            ? "border-sky-200 bg-sky-50"
                            : "border-zinc-200 bg-white hover:bg-zinc-50"
                        )}
                      >
                        <div className="text-sm font-semibold text-zinc-900">{label}</div>
                        <div className={cn("mt-1 text-xl font-extrabold", carClass === k ? "text-sky-700" : "text-zinc-900")}>
                          {formatRub(intercityPrices[k])}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Дата/время */}
            <div className="mt-5 grid gap-3">
              <div className="text-base font-extrabold text-zinc-900">Дата и время</div>
              <TextInput
                id={ids.datetime}
                type="datetime-local"
                value={datetimeLocal}
                onChange={(e) => setDatetimeLocal(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <MiniButton type="button" onClick={() => applyQuickTime("plus1")}>Через 1 час</MiniButton>
                <MiniButton type="button" onClick={() => applyQuickTime("today18")}>Сегодня 18:00</MiniButton>
                <MiniButton type="button" onClick={() => applyQuickTime("tomorrow10")}>Завтра 10:00</MiniButton>
              </div>
            </div>

            {/* Имя/телефон */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={ids.name} className="mb-1 block text-sm font-semibold text-zinc-900">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <TextInput id={ids.name} value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" />
              </div>
              <div>
                <label htmlFor={ids.phone} className="mb-1 block text-sm font-semibold text-zinc-900">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id={ids.phone}
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(normalizePhoneLive(e.target.value))}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </div>

            {/* Комментарий */}
            <div className="mt-4">
              <label htmlFor={ids.comment} className="mb-1 block text-sm font-semibold text-zinc-900">
                Комментарий
              </label>
              <textarea
                id={ids.comment}
                className={ControlBase("min-h-[90px] resize-none")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Детское кресло, багаж, рейс…"
              />
            </div>

            {/* Туда-обратно */}
            {routeType === "intercity" && (
              <label className="mt-4 flex items-center justify-end gap-2 text-sm font-semibold text-zinc-900">
                <input
                  id={ids.roundTrip}
                  type="checkbox"
                  className="h-4 w-4"
                  checked={roundTrip}
                  onChange={(e) => setRoundTrip(e.target.checked)}
                />
                Туда-обратно
              </label>
            )}

            {/* Ошибка */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-5 h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 text-base font-semibold text-white shadow-sm",
                loading ? "opacity-60" : "hover:opacity-95"
              )}
            >
              {loading ? "Отправляем…" : "Оформить заказ"}
            </button>

            <div className="mt-3 text-center text-xs text-zinc-500">
              Нажимая “Оформить заказ”, вы соглашаетесь на обработку персональных данных.
            </div>
          </form>

          {/* Сайдбар (desktop) */}
          <aside className="hidden lg:block">
            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
              <div className="text-lg font-extrabold text-zinc-900">Популярные маршруты</div>
              <div className="mt-4 grid gap-2">
                {[
                  ["Москва", "Нижний Новгород"],
                  ["Москва", "Казань"],
                  ["Москва", "Тверь"],
                  ["Москва", "Владимир"],
                  ["СПБ", "Пулково"],
                  ["СПБ", "Москва"],
                ].map(([a, b]) => (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                    onClick={() => {
                      setRouteType("intercity");
                      setFromText(a);
                      setToText(b);
                    }}
                  >
                    <span>{a} → {b}</span>
                    <span className="text-zinc-400">›</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 border-t border-zinc-200 pt-6 text-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">✓</span>
                  <div className="font-semibold text-zinc-900">Фиксированная цена</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">👤</span>
                  <div className="font-semibold text-zinc-900">Водители с опытом</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">⚡</span>
                  <div className="font-semibold text-zinc-900">Быстрая подача</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}