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
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim() && phone.trim() && fromText.trim() && toText.trim();
  }, [name, phone, fromText, toText]);

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
        datetime: datetimeLocal || null,
        carClass,
        comment: comment.trim() || null,
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ваше имя *">
          <input
            className={ControlBase()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
          />
        </Field>

        <Field label="Телефон *" hint="РФ номер">
          <input
            className={ControlBase()}
            value={phone}
            onChange={(e) => {
              let v = e.target.value;

              // 8XXXXXXXXXX -> +7XXXXXXXXXX
              if (v.startsWith("8")) v = "+7" + v.slice(1);

              // 7XXXXXXXXXX -> +7XXXXXXXXXX
              if (v.startsWith("7")) v = "+7" + v.slice(1);

              // +8XXXXXXXXXX -> +7XXXXXXXXXX
              if (v.startsWith("+8")) v = "+7" + v.slice(2);

              setPhone(v);
            }}
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

        <Field label="Комментарий" className="sm:col-span-2">
          <textarea
            className={cn(
              "min-h-[96px] w-full rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm outline-none",
              "focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            )}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Багаж, кресло, рейс и т.д."
          />
        </Field>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <button
        disabled={loading || !canSubmit}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-extrabold text-white",
          "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {loading ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
