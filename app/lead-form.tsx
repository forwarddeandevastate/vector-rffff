"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import GooglePlacesInput from "@/app/ui/google-places-input";

export type CarClass = "standard" | "comfort" | "business" | "minivan";
export type RouteType = "city" | "airport" | "intercity";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function formatRub(n: number) {
  return `${Math.round(n).toLocaleString("ru-RU")} ₽`;
}

function formatFrom(n: number) {
  return `от ${Math.round(n).toLocaleString("ru-RU")} ₽`;
}

function formatDurationRU(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h <= 0) return `${m} мин`;
  if (m <= 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

const PER_KM: Record<CarClass, number> = {
  standard: 30,
  comfort: 37,
  minivan: 55,
  business: 65,
};

const CITY_BASE_PRICE: Record<CarClass, number> = {
  standard: 1000,
  comfort: 1500,
  business: 3000,
  minivan: 3500,
};

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

const POPULAR_CITIES = [
  "Москва","Санкт-Петербург","Казань","Нижний Новгород","Самара","Екатеринбург","Краснодар",
  "Ростов-на-Дону","Воронеж","Уфа","Пермь","Волгоград","Саратов","Тюмень","Ярославль",
  "Тверь","Иваново","Калуга","Кострома","Белгород","Курск","Брянск","Липецк","Орел",
  "Чебоксары","Йошкар-Ола","Смоленск",
];

function looksLikeAirport(s: string) {
  const v = normalize(s);
  if (!v) return false;
  if (v.includes("аэроп")) return true;
  const tokens = ["шереметьево", "домодедово", "внуково", "пулково", "храброво", "кольцово", "толмач", "курумоч", "пашков", "адлер", "аэропорт"];
  if (tokens.some((t) => v.includes(t))) return true;
  return /\b(svo|dme|vko|led|aer|svx|ovb|kuf|kzn|krr|kgd)\b/i.test(s);
}

function sameCity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return false;
  const cities = [
    "москва","санкт-петербург","санкт петербург","спб","казань","нижний новгород","екатеринбург",
    "самара","ростов-на-дону","краснодар","воронеж","уфа","челябинск","пермь","волгоград",
    "саратов","тюмень","ярославль","тула","рязань","тверь","иваново","калуга","кострома",
    "белгород","курск","брянск","липецк","орел","чебоксары","йошкар-ола","смоленск",
  ];
  const pick = (s: string) => cities.find((c) => s.includes(c)) || null;
  const ca = pick(x);
  const cb = pick(y);
  return ca && cb ? ca.replace("-", " ") === cb.replace("-", " ") : x === y;
}

function pickSuggestions(value: string, routeType: RouteType) {
  const q = normalize(value);
  const source = routeType === "airport" ? [...AIRPORT_HINTS, ...POPULAR_CITIES] : POPULAR_CITIES;
  if (!q) return source.slice(0, 8);
  return source.filter((item) => normalize(item).includes(q)).slice(0, 8);
}

function normalizePhoneLive(input: string) {
  let v = input;
  if (v.startsWith("+8")) v = "+7" + v.slice(2);
  else if (v.startsWith("8")) v = "+7" + v.slice(1);
  else if (v.startsWith("7")) v = "+7" + v.slice(1);
  else if (v.startsWith("9")) v = "+7" + v;
  return v;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDatetimeLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function addMinutes(base: Date, minutes: number) {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function setTimeSameDay(base: Date, hh: number, mm: number) {
  const d = new Date(base);
  d.setHours(hh, mm, 0, 0);
  return d;
}

function IconPlane() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 19l20-7-20-7 5 7-5 7Z" /><path d="M7 12h15" /></svg>;
}
function IconCar() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 16l1.4-5A2 2 0 0 1 8.3 9h7.4a2 2 0 0 1 1.9 2L19 16" /><path d="M3 16h18" /><circle cx="7" cy="17" r="1.7" /><circle cx="17" cy="17" r="1.7" /></svg>;
}
function IconCity() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V9l6-3v15" /><path d="M11 21V4l8 3v14" /></svg>;
}
function IconPin() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
function IconSwap() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h11" /><path d="m14 4 4 3-4 3" /><path d="M17 17H6" /><path d="m10 14-4 3 4 3" /></svg>;
}
function IconCalendar() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>;
}
function IconArrowRight() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></svg>;
}

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-[18px] px-3 text-[13px] font-extrabold transition sm:text-[15px]",
        active ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]" : "text-zinc-800"
      )}
    >
      {icon}<span className="truncate">{label}</span>
    </button>
  );
}

function PriceCard({ active, title, price, onClick }: { active: boolean; title: string; price: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[18px] border p-3 text-left transition",
        active ? "border-blue-200 bg-blue-50 shadow-[0_8px_18px_rgba(37,99,235,0.07)]" : "border-zinc-200 bg-white hover:bg-zinc-50"
      )}
    >
      <div className={cn("text-[13px] font-bold", active ? "text-blue-700" : "text-zinc-900")}>{title}</div>
      <div className={cn("mt-1 text-[12px] font-extrabold sm:text-[13px]", active ? "text-blue-700" : "text-zinc-900")}>{price}</div>
    </button>
  );
}

export default function LeadForm({ carClass, onCarClassChange, routeType, onRouteTypeChange, initialFrom, initialTo }: { carClass: CarClass; onCarClassChange: (v: CarClass) => void; routeType: RouteType; onRouteTypeChange: (v: RouteType) => void; initialFrom?: string; initialTo?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fromText, setFromText] = useState(initialFrom ?? "");
  const [toText, setToText] = useState(initialTo ?? "");
  const [fromPlaceId, setFromPlaceId] = useState<string | null>(null);
  const [toPlaceId, setToPlaceId] = useState<string | null>(null);
  const [datetimeLocal, setDatetimeLocal] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [km, setKm] = useState<number | null>(null);
  const [travelSeconds, setTravelSeconds] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const fromBoxRef = useRef<HTMLDivElement | null>(null);
  const toBoxRef = useRef<HTMLDivElement | null>(null);

  const fromSuggestions = useMemo(() => pickSuggestions(fromText, routeType), [fromText, routeType]);
  const toSuggestions = useMemo(() => pickSuggestions(toText, routeType), [toText, routeType]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const node = e.target as Node;
      if (fromBoxRef.current && !fromBoxRef.current.contains(node)) setFromOpen(false);
      if (toBoxRef.current && !toBoxRef.current.contains(node)) setToOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const a = normalize(fromText);
    const b = normalize(toText);
    if (!a || !b) return;
    if (looksLikeAirport(fromText) || looksLikeAirport(toText)) {
      if (routeType !== "airport") onRouteTypeChange("airport");
      return;
    }
    if (sameCity(fromText, toText)) {
      if (routeType !== "city") onRouteTypeChange("city");
      return;
    }
    if (routeType !== "intercity") onRouteTypeChange("intercity");
  }, [fromText, toText, routeType, onRouteTypeChange]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function run() {
      setCalcError(null);
      setKm(null);
      setTravelSeconds(null);
      if (!fromText.trim() || !toText.trim()) return;
      setCalcLoading(true);
      try {
        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ from: fromText.trim(), to: toText.trim(), fromPlaceId, toPlaceId }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setCalcError(data?.error || "Не удалось рассчитать расстояние");
          return;
        }
        setKm(Number(data.km) || null);
        setTravelSeconds(Number(data.seconds) || null);
      } catch (e: unknown) {
        if (cancelled) return;
        if (e && typeof e === "object" && "name" in e && (e as { name?: string }).name === "AbortError") return;
        setCalcError("Не удалось рассчитать расстояние");
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
  }, [fromText, toText, fromPlaceId, toPlaceId]);

  const pricesByClass = useMemo(() => {
    const calcFor = (klass: CarClass) => {
      if (routeType === "city") return CITY_BASE_PRICE[klass];
      if (!km) return null;
      let total = Math.round(km * PER_KM[klass]);
      if (routeType === "airport") total = Math.round(total * 1.1);
      if (roundTrip) total *= 2;
      return total;
    };
    return { standard: calcFor("standard"), comfort: calcFor("comfort"), business: calcFor("business"), minivan: calcFor("minivan") };
  }, [routeType, km, roundTrip]);

  const finalPrice = pricesByClass[carClass];
  const travelTimeText = useMemo(() => (travelSeconds && Number.isFinite(travelSeconds) ? formatDurationRU(travelSeconds) : null), [travelSeconds]);
  const canSubmit = Boolean(name.trim() && phone.trim() && fromText.trim() && toText.trim());
  const tripTitle = fromText.trim() && toText.trim() ? `${fromText.trim()} → ${toText.trim()}` : routeType === "airport" ? "Аэропорт → Город" : routeType === "city" ? "Поездка по городу" : "Межгородний маршрут";

  function swapPlaces() {
    setFromText(toText);
    setToText(fromText);
    setFromPlaceId(toPlaceId);
    setToPlaceId(fromPlaceId);
    setFromOpen(false);
    setToOpen(false);
  }

  function applyQuickTime(kind: "plus1" | "today18" | "tomorrow10") {
    const now = new Date();
    let d = now;
    if (kind === "plus1") d = addMinutes(now, 60);
    if (kind === "today18") d = setTimeSameDay(now, 18, 0);
    if (kind === "tomorrow10") {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      d = setTimeSameDay(t, 10, 0);
    }
    setDatetimeLocal(toDatetimeLocal(d));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Заполните имя, телефон, откуда и куда.");
      return;
    }
    setLoading(true);
    try {
      const calcNote = finalPrice != null ? `\n\n[Авторасчёт]${roundTrip ? " туда-обратно" : ""}${travelTimeText ? ` (~${travelTimeText})` : ""}: ${formatRub(finalPrice)}` : "";
      const payload = {
        name: name.trim(), phone: phone.trim(), fromText: fromText.trim(), toText: toText.trim(), datetime: datetimeLocal || null, carClass, roundTrip,
        comment: (comment.trim() || "") + calcNote || null,
      };
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка отправки");
      router.push("/thanks");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="grid gap-5">
        <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-zinc-50 p-2">
          <TabButton active={routeType === "airport"} icon={<IconPlane />} label="Аэропорт" onClick={() => onRouteTypeChange("airport")} />
          <TabButton active={routeType === "intercity"} icon={<IconCar />} label="Межгород" onClick={() => onRouteTypeChange("intercity")} />
          <TabButton active={routeType === "city"} icon={<IconCity />} label="Город" onClick={() => onRouteTypeChange("city")} />
        </div>

        <div className="grid gap-4">
          <div ref={fromBoxRef} className="relative">
            <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Откуда</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-500"><IconPin /></div>
              <GooglePlacesInput
                className="h-14 w-full rounded-[18px] border border-zinc-200 bg-white pl-12 pr-4 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                value={fromText}
                onValueChange={(v) => { setFromText(v); setFromPlaceId(null); setFromOpen(true); }}
                onPlacePick={({ placeId, address }) => { setFromText(address); setFromPlaceId(placeId); setFromOpen(false); }}
                placeholder="Город, адрес, аэропорт"
              />
            </div>
            {fromOpen && fromSuggestions.length > 0 ? <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[18px] border border-zinc-200 bg-white shadow-xl">{fromSuggestions.map((item) => <button key={item} type="button" className="block w-full px-4 py-3 text-left text-sm text-zinc-800 hover:bg-blue-50" onClick={() => { setFromText(item); setFromPlaceId(null); setFromOpen(false); }}>{item}</button>)}</div> : null}
          </div>

          <div className="relative pt-2">
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
              <button type="button" onClick={swapPlaces} className="grid h-14 w-14 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-[0_8px_20px_rgba(15,23,42,0.10)] transition hover:text-blue-600"><IconSwap /></button>
            </div>
            <div ref={toBoxRef} className="relative">
              <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Куда</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-500"><IconPin /></div>
                <GooglePlacesInput
                  className="h-14 w-full rounded-[18px] border border-zinc-200 bg-white pl-12 pr-4 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                  value={toText}
                  onValueChange={(v) => { setToText(v); setToPlaceId(null); setToOpen(true); }}
                  onPlacePick={({ placeId, address }) => { setToText(address); setToPlaceId(placeId); setToOpen(false); }}
                  placeholder="Город, адрес, аэропорт"
                />
              </div>
              {toOpen && toSuggestions.length > 0 ? <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[18px] border border-zinc-200 bg-white shadow-xl">{toSuggestions.map((item) => <button key={item} type="button" className="block w-full px-4 py-3 text-left text-sm text-zinc-800 hover:bg-blue-50" onClick={() => { setToText(item); setToPlaceId(null); setToOpen(false); }}>{item}</button>)}</div> : null}
            </div>
          </div>

          <button type="button" className="flex h-14 w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-[18px] font-extrabold text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)]">
            <span>Рассчитать маршрут</span>
            <IconPlane />
          </button>
        </div>

        <div className="rounded-[22px] border border-zinc-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <div>
              <div className="text-[18px] font-black text-zinc-900 sm:text-[20px]">{tripTitle}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-zinc-600">
                {calcLoading ? <span>Считаем маршрут…</span> : calcError ? <span className="text-rose-600">{calcError}</span> : <>{km ? <span className="font-semibold text-orange-500">~ {Math.round(km)} км</span> : null}{km && travelTimeText ? <span>•</span> : null}{travelTimeText ? <span>~ {travelTimeText}</span> : null}{!km && routeType === "city" ? <span>{formatFrom(CITY_BASE_PRICE[carClass])}</span> : null}</>}
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[15px] font-semibold text-zinc-500">цена</div>
              <div className="text-[24px] font-black text-zinc-950 sm:text-[26px]">{finalPrice != null ? formatRub(finalPrice) : routeType === "city" ? formatFrom(CITY_BASE_PRICE[carClass]) : "—"}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600 md:justify-end"><IconCar /><span>{carClass === "standard" ? "Стандарт" : carClass === "comfort" ? "Комфорт" : carClass === "business" ? "Бизнес" : "Минивен"}</span></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <PriceCard active={carClass === "standard"} title="Стандарт" price={pricesByClass.standard != null ? formatRub(pricesByClass.standard) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.standard) : "—"} onClick={() => onCarClassChange("standard")} />
            <PriceCard active={carClass === "comfort"} title="Комфорт" price={pricesByClass.comfort != null ? formatRub(pricesByClass.comfort) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.comfort) : "—"} onClick={() => onCarClassChange("comfort")} />
            <PriceCard active={carClass === "business"} title="Бизнес" price={pricesByClass.business != null ? formatRub(pricesByClass.business) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.business) : "—"} onClick={() => onCarClassChange("business")} />
            <PriceCard active={carClass === "minivan"} title="Минивен" price={pricesByClass.minivan != null ? formatRub(pricesByClass.minivan) : routeType === "city" ? formatFrom(CITY_BASE_PRICE.minivan) : "—"} onClick={() => onCarClassChange("minivan")} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Дата и время</label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"><IconCalendar /></div>
            <input className="h-14 w-full rounded-[18px] border border-zinc-200 bg-white pl-12 pr-4 text-[16px] text-zinc-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50" type="datetime-local" value={datetimeLocal} onChange={(e) => setDatetimeLocal(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => applyQuickTime("plus1")} className="h-10 rounded-[16px] border border-zinc-200 bg-white px-4 text-[14px] font-bold text-zinc-700">Через 1 час</button>
            <button type="button" onClick={() => applyQuickTime("today18")} className="h-10 rounded-[16px] border border-zinc-200 bg-white px-4 text-[14px] font-bold text-zinc-700">Сегодня 18:00</button>
            <button type="button" onClick={() => applyQuickTime("tomorrow10")} className="h-10 rounded-[16px] border border-zinc-200 bg-white px-4 text-[14px] font-bold text-zinc-700">Завтра 10:00</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Ваше имя</label>
            <input className="h-14 w-full rounded-[18px] border border-zinc-200 bg-white px-4 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" autoComplete="name" />
          </div>
          <div>
            <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Телефон</label>
            <input className="h-14 w-full rounded-[18px] border border-zinc-200 bg-white px-4 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50" value={phone} onChange={(e) => setPhone(normalizePhoneLive(e.target.value))} placeholder="+7 (___) ___-__-__" inputMode="tel" autoComplete="tel" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[15px] font-extrabold text-zinc-900">Комментарий</label>
          <textarea className="min-h-[96px] w-full rounded-[18px] border border-zinc-200 bg-white px-4 py-3 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Детское кресло, багаж, рейс..." />
        </div>

        <div className="flex items-center justify-start sm:justify-end">
          <label className="inline-flex cursor-pointer items-center gap-3 text-[18px] font-bold text-zinc-800">
            <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="h-6 w-6 rounded-md border-zinc-300 accent-blue-600" />
            Туда-обратно
          </label>
        </div>

        {error ? <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{error}</div> : null}

        <button disabled={loading || !canSubmit} className="flex h-14 w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-[18px] font-extrabold text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
          <span>{loading ? "Отправляем…" : "Оформить заказ"}</span><IconArrowRight />
        </button>
      </div>
    </form>
  );
}
