"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function onlyDigits(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

// Простая маска под RU: +7 (999) 123-45-67
function formatRuPhone(input: string) {
  const d = onlyDigits(input);

  // если пользователь начал с 8 или 7, считаем что RU
  let digits = d;
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) {
    // если не 7 — просто возвращаем +<digits> или как есть
    return digits ? "+" + digits : "";
  }

  const rest = digits.slice(1); // 10 цифр
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 6);
  const c = rest.slice(6, 8);
  const e = rest.slice(8, 10);

  let out = "+7";
  if (a) out += ` (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (e) out += `-${e}`;
  return out;
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

  // UTM
  const [utmSource, setUtmSource] = useState<string | null>(null);
  const [utmMedium, setUtmMedium] = useState<string | null>(null);
  const [utmCampaign, setUtmCampaign] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim() && phone.trim() && fromText.trim() && toText.trim();
  }, [name, phone, fromText, toText]);

  useEffect(() => {
    // безопасно: только на клиенте
    const sp = new URLSearchParams(window.location.search);
    setUtmSource(sp.get("utm_source"));
    setUtmMedium(sp.get("utm_medium"));
    setUtmCampaign(sp.get("utm_campaign"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполни имя, телефон, откуда и куда.");
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

        utmSource,
        utmMedium,
        utmCampaign,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка отправки");

      // если это дубликат — всё равно “спасибо”, но можно показать сообщение
      // (пока просто отправляем на thanks)
      router.push("/thanks");
    } catch (e: any) {
      setError(e?.message || "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ваше имя *">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Иван" />
        </Field>

        <Field label="Телефон *">
          <input
            value={phone}
            onChange={(e) => setPhone(formatRuPhone(e.target.value))}
            className="input"
            placeholder="+7 (999) 123-45-67"
            inputMode="tel"
          />
        </Field>

        <Field label="Откуда *" className="sm:col-span-2">
          <input
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
            className="input"
            placeholder="Москва, аэропорт Шереметьево"
          />
        </Field>

        <Field label="Куда *" className="sm:col-span-2">
          <input value={toText} onChange={(e) => setToText(e.target.value)} className="input" placeholder="Москва, центр" />
        </Field>

        <Field label="Дата/время" className="sm:col-span-2">
          <input
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="input"
            placeholder="Например: сегодня 18:30 или 2026-01-20 10:00"
          />
        </Field>

        <Field label="Класс авто">
          <select value={carClass} onChange={(e) => setCarClass(e.target.value)} className="input">
            <option value="standard">Стандарт</option>
            <option value="comfort">Комфорт</option>
            <option value="business">Бизнес</option>
            <option value="minivan">Минивэн</option>
          </select>
        </Field>

        <Field label="Туда-обратно">
          <label className="flex h-11 items-center gap-2 rounded-xl border px-3">
            <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="h-4 w-4" />
            <span className="text-sm">Нужен обратный трансфер</span>
          </label>
        </Field>

        <Field label="Комментарий" className="sm:col-span-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[90px] w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Детское кресло, багаж, номер рейса и т.п."
          />
        </Field>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">{error}</div>
      ) : null}

      <button
        disabled={loading || !canSubmit}
        className={cn(
          "mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-extrabold text-white shadow-sm transition",
          "hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {loading ? "Отправляем…" : "Отправить заявку"}
      </button>

      <p className="mt-3 text-xs text-zinc-500">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>

      <style jsx>{`
        .input {
          height: 44px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgb(228 228 231);
          padding: 0 12px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          box-shadow: 0 0 0 2px rgb(228 228 231);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1 text-xs font-semibold text-zinc-600">{label}</div>
      {children}
    </div>
  );
}
