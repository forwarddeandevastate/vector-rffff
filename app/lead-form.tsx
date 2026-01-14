"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CarClass = "standard" | "comfort" | "business" | "minivan";

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

function isAirportText(s: string) {
  const t = s.toLowerCase();
  return /аэропорт|airport|svo|dme|vko|svx|led|aer|kuf|kgd|ovb|krr|kzn/.test(t);
}

function isSameCityLikely(from: string, to: string) {
  // Очень грубая эвристика: если обе строки короткие и похожи — город.
  // Но реальнее: если нет признаков аэропорта и нет "город - город" по запятой.
  const f = from.trim().toLowerCase();
  const tt = to.trim().toLowerCase();
  if (!f || !tt) return true;
  if (isAirportText(f) || isAirportText(tt)) return false;
  // Если обе строки содержат слова "г." или город как отдельный токен — не определяем,
  // будем считать "город", пока не увидим явный межгород.
  return true;
}

function isIntercityLikely(from: string, to: string) {
  // Эвристика: если явно указаны два разных города (через "—", "-", "->") или две запятые
  const s = `${from} ${to}`.toLowerCase();
  if (isAirportText(from) || isAirportText(to)) return false;

  if (/[—–-]|->/.test(s)) return true;

  // если оба поля содержат запятую (обычно "город, адрес") — это может быть межгород, но не факт.
  // добавим лёгкий сигнал: если слова "город" / "область" / "край" встречаются много.
  const signals = (s.match(/область|край|республика|район/g) || []).length;
  if (signals >= 1) return true;

  // без явных признаков — не межгород
  return false;
}

function formatRub(n: number) {
  // 12000 -> "12 000 ₽"
  const s = String(n);
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(s.slice(start, i));
  }
  return `${parts.join(" ")} ₽`;
}

function calcEstimate(routeType: "city" | "airport" | "intercity", carClass: CarClass) {
  // Базовые ориентиры (можешь менять)
  const base = {
    city: { min: 1500, max: 3500 },
    airport: { min: 2500, max: 6000 },
    intercity: { min: 7000, max: 18000 },
  }[routeType];

  const mult =
    carClass === "standard" ? 1 :
    carClass === "comfort" ? 1.25 :
    carClass === "business" ? 1.7 :
    1.55; // minivan

  const min = Math.round(base.min * mult);
  const max = Math.round(base.max * mult);

  const label =
    routeType === "city" ? "По городу" :
    routeType === "airport" ? "Аэропорт" :
    "Межгород";

  return {
    label,
    min,
    max,
    text: `${label}: ${formatRub(min)} – ${formatRub(max)}`,
  };
}

export default function LeadForm({
  carClass,
  onCarClassChange,
}: {
  carClass: CarClass;
  onCarClassChange: (v: CarClass) => void;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [datetime, setDatetime] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim() && phone.trim() && fromText.trim() && toText.trim();
  }, [name, phone, fromText, toText]);

  const routeType = useMemo<"city" | "airport" | "intercity">(() => {
    if (isAirportText(fromText) || isAirportText(toText)) return "airport";
    if (isIntercityLikely(fromText, toText)) return "intercity";
    // по умолчанию город
    return "city";
  }, [fromText, toText]);

  const estimate = useMemo(() => calcEstimate(routeType, carClass), [routeType, carClass]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        fromText: fromText.trim(),
        toText: toText.trim(),
        datetime: datetime.trim() ? datetime.trim() : null,
        carClass,
        roundTrip,
        comment: comment.trim() ? comment.trim() : null,
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
      {/* ОРИЕНТИР СТОИМОСТИ */}
      <div className="rounded-2xl border border-sky-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-zinc-700">Ориентир стоимости</div>
            <div className="mt-1 text-base font-extrabold text-zinc-900">{estimate.text}</div>
            <div className="mt-1 text-[11px] leading-5 text-zinc-600">
              Это примерный диапазон по типу маршрута и классу авто. Точную стоимость подтвердим после заявки.
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
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

        <Field label="Откуда *" className="sm:col-span-2">
          <input
            className={ControlBase()}
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
            placeholder="Город, адрес, аэропорт"
          />
        </Field>

        <Field label="Куда *" className="sm:col-span-2">
          <input
            className={ControlBase()}
            value={toText}
            onChange={(e) => setToText(e.target.value)}
            placeholder="Город, адрес"
          />
        </Field>

        <Field label="Дата и время" hint="Если известно" className="sm:col-span-2">
          <input
            className={ControlBase()}
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            placeholder="Например: сегодня 18:30"
          />
        </Field>

        <Field label="Класс авто" hint="Подсветит карточку ниже">
          <select
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

      <div className="text-[11px] leading-5 text-zinc-500">
        Диапазон стоимости — ориентир. Итоговую сумму подтверждаем после уточнения маршрута и деталей.
      </div>
    </form>
  );
}
