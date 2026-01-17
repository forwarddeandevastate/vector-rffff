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
    >
      {children}
    </button>
  );
}

// тариф ₽/км
const PER_KM = {
  standard: 30,
  comfort: 37,
  minivan: 52,
  business: 65,
} as const;

/** ✅ только автоправка РФ */
function normalizePhoneLive(input: string) {
  let v = input;
  if (v.startsWith("+8")) v = "+7" + v.slice(2);
  else if (v.startsWith("8")) v = "+7" + v.slice(1);
  else if (v.startsWith("7")) v = "+7" + v.slice(1);
  return v;
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
  const [datetimeLocal, setDatetimeLocal] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => name.trim() && phone.trim() && fromText.trim() && toText.trim(),
    [name, phone, fromText, toText]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          fromText: fromText.trim(),
          toText: toText.trim(),
          datetime: datetimeLocal || null,
          carClass,
          roundTrip,
          comment: comment.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка отправки");

      router.push("/thanks");
    } catch (e: any) {
      setError(e.message || "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ваше имя *">
          <input
            className={ControlBase()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
          />
        </Field>

        {/* ⬇⬇⬇ ТОЛЬКО ТУТ ИЗМЕНЕНИЕ */}
        <Field label="Телефон *">
          <input
            className={ControlBase()}
            value={phone}
            onChange={(e) => setPhone(normalizePhoneLive(e.target.value))}
            placeholder="+7 999 123-45-67"
            inputMode="tel"
          />
        </Field>

        <Field label="Откуда *" className="sm:col-span-2">
          <input
            className={ControlBase()}
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
            placeholder="Москва"
          />
        </Field>

        <Field label="Куда *" className="sm:col-span-2">
          <input
            className={ControlBase()}
            value={toText}
            onChange={(e) => setToText(e.target.value)}
            placeholder="Санкт-Петербург"
          />
        </Field>

        <Field label="Дата и время" className="sm:col-span-2">
          <input
            className={ControlBase()}
            type="datetime-local"
            value={datetimeLocal}
            onChange={(e) => setDatetimeLocal(e.target.value)}
          />
        </Field>

        <Field label="Класс авто">
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
          <label className={cn(ControlBase("flex items-center gap-2"))}>
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            Туда-обратно
          </label>
        </Field>

        <Field label="Комментарий" className="sm:col-span-2">
          <textarea
            className={cn(
              "min-h-[96px] w-full rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm outline-none",
              "focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            )}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Багаж, кресло, рейс"
          />
        </Field>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {error}
        </div>
      )}

      <button
        disabled={loading || !canSubmit}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-extrabold text-white",
          "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600",
          "disabled:opacity-60"
        )}
      >
        {loading ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
