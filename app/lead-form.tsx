"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function LeadForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [datetime, setDatetime] = useState("");
  const [carClass, setCarClass] = useState("standard");
  const [roundTrip, setRoundTrip] = useState(false);
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

        <Field label="Класс авто">
          <select className={ControlBase()} value={carClass} onChange={(e) => setCarClass(e.target.value)}>
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
