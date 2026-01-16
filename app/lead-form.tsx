"use client";

import { useEffect, useMemo, useState } from "react";

export type CarClass = "standard" | "comfort" | "minivan" | "business";
export type RouteType = "city" | "intercity" | "airport";

type Props = {
  carClass: CarClass;
  onCarClassChange: (v: CarClass) => void;

  routeType: RouteType;
  onRouteTypeChange: (v: RouteType) => void;
};

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Нижний Новгород",
  "Ростов-на-Дону",
  "Краснодар",
  "Сочи",
  "Екатеринбург",
  "Новосибирск",
  "Самара",
  "Воронеж",
  "Уфа",
  "Пермь",
  "Волгоград",
  "Саратов",
  "Тула",
  "Калининград",
  "Белгород",
  "Курск",
  "Брянск",
  "Донецк (ДНР)",
  "Луганск (ЛНР)",
  "Мелитополь (Запорожье)",
  "Геническ (Херсон)",
];

const RATES_RUB_PER_KM: Record<CarClass, number> = {
  standard: 30,
  comfort: 37,
  minivan: 52,
  business: 65,
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function norm(s: string) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function detectTripType(fromCity?: string | null, toCity?: string | null) {
  const a = norm(fromCity || "");
  const b = norm(toCity || "");
  if (!a || !b) return "city" as const;
  return a !== b ? ("intercity" as const) : ("city" as const);
}

function calcIntercityPrice(distanceKm: number, carClass: CarClass) {
  const rate = RATES_RUB_PER_KM[carClass] ?? RATES_RUB_PER_KM.standard;
  const raw = distanceKm * rate;
  return Math.round(raw / 10) * 10; // округление до 10 ₽
}

export default function LeadForm({
  carClass,
  onCarClassChange,
  routeType,
  onRouteTypeChange,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const [datetime, setDatetime] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Автоопределение по городам: разные города -> межгород
  const autoTripType = useMemo(() => detectTripType(fromCity, toCity), [fromCity, toCity]);

  // Если пользователь выбрал "airport" — не перетираем.
  // Если airport не выбран — routeType автоматически будет city/intercity по городам.
  useEffect(() => {
    if (routeType === "airport") return;

    const next: RouteType = autoTripType === "intercity" ? "intercity" : "city";
    if (next !== routeType) onRouteTypeChange(next);
  }, [autoTripType, routeType, onRouteTypeChange]);

  // ✅ Авторасчет расстояния только для межгорода
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setErr(null);

      if (routeType !== "intercity") {
        setDistanceKm(null);
        setPrice(null);
        return;
      }

      if (!fromCity || !toCity) {
        setDistanceKm(null);
        setPrice(null);
        return;
      }

      try {
        setDistanceKm(null);
        setPrice(null);

        const r = await fetch("/api/geo/distance", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fromCity, toCity }),
        });

        const data = await r.json().catch(() => null);
        if (!r.ok || !data?.ok) throw new Error(data?.error || "Ошибка расчёта расстояния");

        if (!cancelled) setDistanceKm(Number(data.distanceKm));
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message || "Ошибка расчёта расстояния");
          setDistanceKm(null);
          setPrice(null);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [routeType, fromCity, toCity]);

  // ✅ Авторасчет цены только для межгорода
  useEffect(() => {
    if (routeType !== "intercity") {
      setPrice(null);
      return;
    }
    if (distanceKm && distanceKm > 0) {
      const base = calcIntercityPrice(distanceKm, carClass);
      setPrice(roundTrip ? base * 2 : base);
    } else {
      setPrice(null);
    }
  }, [routeType, distanceKm, carClass, roundTrip]);

  async function submit() {
    setBusy(true);
    setErr(null);

    try {
      const payload = {
        name,
        phone,
        fromText: fromCity,
        toText: toCity,
        datetime: datetime || null,
        carClass,
        roundTrip,
        comment: comment || null,
        price: price ?? null,
        routeType,
      };

      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Не удалось отправить");

      window.location.href = "/thanks";
    } catch (e: any) {
      setErr(e?.message || "Ошибка отправки");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-semibold text-zinc-800">Имя</span>
          <input
            className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-zinc-800">Телефон</span>
          <input
            className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7..."
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-zinc-800">Откуда (город)</span>
            <select
              className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            >
              <option value="">Выберите</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-zinc-800">Куда (город)</span>
            <select
              className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
            >
              <option value="">Выберите</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-zinc-800">Дата/время (необязательно)</span>
          <input
            className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            placeholder="Например: сегодня 18:00"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-zinc-800">Класс авто</span>
            <select
              className="h-11 rounded-2xl border border-zinc-200 bg-white px-4 text-zinc-900 outline-none focus:border-sky-300"
              value={carClass}
              onChange={(e) => onCarClassChange(e.target.value as CarClass)}
            >
              <option value="standard">Стандарт</option>
              <option value="comfort">Комфорт</option>
              <option value="minivan">Минивэн</option>
              <option value="business">Бизнес</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} />
            <span className="text-sm font-semibold text-zinc-800">Туда-обратно</span>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-zinc-800">Комментарий (необязательно)</span>
          <textarea
            className="min-h-[90px] rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-900 outline-none focus:border-sky-300"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Пожелания по багажу, креслу, рейсу и т.д."
          />
        </label>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-zinc-900">
            Тип:{" "}
            {routeType === "intercity" ? "Межгород" : routeType === "airport" ? "Аэропорт" : "По городу"}
          </div>

          {routeType === "intercity" ? (
            <div className="text-sm text-zinc-700">
              {distanceKm ? (
                <>Расстояние: <b>{distanceKm} км</b></>
              ) : (
                <span className="text-zinc-500">Считаем…</span>
              )}
            </div>
          ) : null}
        </div>

        {routeType === "intercity" ? (
          <div className="mt-2 text-sm text-zinc-700">
            Итог:{" "}
            <span className="text-base font-extrabold text-blue-700">
              {price ? `${price.toLocaleString("ru-RU")} ₽` : "—"}
            </span>
          </div>
        ) : (
          <div className="mt-2 text-sm text-zinc-500">Стоимость уточним после заявки.</div>
        )}
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{err}</div>
      ) : null}

      <button
        disabled={busy}
        onClick={submit}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center rounded-2xl px-6 text-sm font-extrabold text-white shadow-sm",
          "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:opacity-95",
          busy && "opacity-60"
        )}
      >
        {busy ? "Отправляем…" : "Отправить заявку"}
      </button>
    </div>
  );
}
