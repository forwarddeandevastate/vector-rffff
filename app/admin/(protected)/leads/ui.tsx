"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "DISPATCHER";
  isActive: boolean;
};

type Lead = {
  id: number;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  datetime: string | null;
  carClass: string;
  roundTrip: boolean;
  price: number | null;
  comment: string | null;
  status: "new" | "in_progress" | "done" | "canceled";
  assignedToId: number | null;
  isDuplicate: boolean;
  duplicateOfId: number | null;
  createdAt: string;
};

const STATUS_LABEL: Record<Lead["status"], string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Завершён",
  canceled: "Отменён",
};

const STATUS_OPTIONS: Array<{ value: "all" | Lead["status"]; label: string }> = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Завершённые" },
  { value: "canceled", label: "Отменённые" },
];

function fmt(dt: string) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

function digitsOnly(s: string) {
  return (s || "").replace(/[^\d]/g, "");
}

function waLink(phone: string) {
  const p = digitsOnly(phone);
  return p ? `https://wa.me/${p}` : null;
}

function tgLink(phone: string) {
  const p = digitsOnly(phone);
  return p ? `https://t.me/+${p}` : null;
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "neutral" | "new" | "work" | "done" | "canceled" | "dupe";
}) {
  const cls =
    tone === "new"
      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
      : tone === "work"
      ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200"
      : tone === "done"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
      : tone === "canceled"
      ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
      : tone === "dupe"
      ? "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
      : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", cls)}>
      {children}
    </span>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [status, setStatus] = useState<"all" | Lead["status"]>("all");
  const [q, setQ] = useState("");
  const [onlyDupes, setOnlyDupes] = useState(false);
  const [loading, setLoading] = useState(false);

  // локальные правки по leadId
  const [draft, setDraft] = useState<Record<number, { price?: string; comment?: string; datetime?: string }>>({});

  // для видимого фидбэка по кнопкам (на каждый лид отдельно)
  const [busy, setBusy] = useState<Record<number, string | null>>({}); // например "status:done", "save", "assign"
  const [flash, setFlash] = useState<Record<number, "ok" | "err" | null>>({}); // краткий подсвет карточки

  // refs по leadId, чтобы "открыть оригинал" мог скроллить
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setRef = (id: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el;
  };

  const dispatchers = useMemo(
    () => users.filter((u) => u.role === "DISPATCHER" && u.isActive),
    [users]
  );
  const singleDispatcherId = dispatchers.length === 1 ? dispatchers[0].id : null;

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setUsers(data.users || []);
  }

  async function loadLeads() {
    setLoading(true);
    const sp = new URLSearchParams();
    if (status !== "all") sp.set("status", status);
    if (q.trim()) sp.set("q", q.trim());

    const res = await fetch(`/api/admin/leads?${sp.toString()}`);
    const data = await res.json().catch(() => ({}));
    let rows: Lead[] = data.leads || [];
    if (onlyDupes) rows = rows.filter((x) => x.isDuplicate);
    setLeads(rows);
    setLoading(false);
  }

  async function patchLead(id: number, patch: any) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка сохранения");
    return data.lead;
  }

  function ping(id: number, kind: "ok" | "err") {
    setFlash((p) => ({ ...p, [id]: kind }));
    setTimeout(() => setFlash((p) => ({ ...p, [id]: null })), 650);
  }

  function openLead(id: number) {
    const el = cardRefs.current[id];
    if (!el) {
      alert("Оригинал не найден в текущем списке (возможно, фильтр скрывает его).");
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("ring-2", "ring-zinc-900", "dark:ring-white");
    setTimeout(() => el.classList.remove("ring-2", "ring-zinc-900", "dark:ring-white"), 1200);
  }

  async function copyPhone(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      prompt("Скопируй телефон:", phone);
      return;
    }
    // небольшой “тихий” успех без alert
  }

  async function quickStatus(id: number, next: Lead["status"]) {
    // optimistic: сразу обновим UI
    setBusy((p) => ({ ...p, [id]: `status:${next}` }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)));

    try {
      await patchLead(id, { status: next });
      ping(id, "ok");
    } catch (e: any) {
      // откат — перезагрузим список, чтобы не гадать
      ping(id, "err");
      await loadLeads();
      alert(e?.message || "Не удалось обновить статус");
    } finally {
      setBusy((p) => ({ ...p, [id]: null }));
    }
  }

  async function assignLead(id: number, assignedToId: number | null) {
    setBusy((p) => ({ ...p, [id]: "assign" }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedToId } : l)));

    try {
      await patchLead(id, { assignedToId });
      ping(id, "ok");
    } catch (e: any) {
      ping(id, "err");
      await loadLeads();
      alert(e?.message || "Не удалось назначить диспетчера");
    } finally {
      setBusy((p) => ({ ...p, [id]: null }));
    }
  }

  async function saveInline(id: number) {
    const d = draft[id] || {};
    const patch: any = {};

    if ("price" in d) {
      const v = (d.price ?? "").trim();
      patch.price = v === "" ? null : Number(v);
      if (v !== "" && !Number.isFinite(patch.price)) {
        alert("Цена должна быть числом");
        return;
      }
    }
    if ("comment" in d) patch.comment = (d.comment ?? "").trim() || null;
    if ("datetime" in d) patch.datetime = (d.datetime ?? "").trim() || null;

    setBusy((p) => ({ ...p, [id]: "save" }));
    // optimistic: применим патч локально
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              ...(patch.price !== undefined ? { price: patch.price } : {}),
              ...(patch.comment !== undefined ? { comment: patch.comment } : {}),
              ...(patch.datetime !== undefined ? { datetime: patch.datetime } : {}),
            }
          : l
      )
    );

    try {
      await patchLead(id, patch);
      setDraft((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      ping(id, "ok");
    } catch (e: any) {
      ping(id, "err");
      await loadLeads();
      alert(e?.message || "Не удалось сохранить");
    } finally {
      setBusy((p) => ({ ...p, [id]: null }));
    }
  }

  // --- Авто-назначение: если диспетчер один и есть новые неназначенные лиды ---
  async function autoAssignIfNeeded(currentLeads: Lead[]) {
    if (!singleDispatcherId) return;
    const targets = currentLeads.filter((l) => l.status === "new" && !l.assignedToId);
    if (targets.length === 0) return;

    const batch = targets.slice(0, 20);
    for (const l of batch) {
      // eslint-disable-next-line no-await-in-loop
      await assignLead(l.id, singleDispatcherId);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadLeads(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, onlyDupes]);

  useEffect(() => {
    if (!loading && leads.length > 0) autoAssignIfNeeded(leads);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleDispatcherId, leads.length]);

  return (
    <div className="p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Лиды</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Быстрые действия с заметным фидбеком: кнопки “нажимаются”, показывают загрузку и результат.
          </p>
        </div>

        <button
          onClick={loadLeads}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          disabled={loading}
        >
          {loading ? <Spinner /> : <span aria-hidden>↻</span>}
          {loading ? "Обновляем…" : "Обновить"}
        </button>
      </div>

      <div className="mb-4 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-6">
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Поиск</label>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-zinc-500" aria-hidden>
              🔎
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Телефон / имя / откуда / куда"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Фильтры</label>
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <input
              type="checkbox"
              checked={onlyDupes}
              onChange={(e) => setOnlyDupes(e.target.checked)}
              className="h-4 w-4"
            />
            Только дубликаты
          </label>
        </div>

        {singleDispatcherId && (
          <div className="sm:col-span-12">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
              ⚡ Авто-назначение включено: есть ровно один активный диспетчер.
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-3">
        {leads.map((l) => {
          const d = draft[l.id] || {};
          const isBusy = !!busy[l.id];
          const busyKey = busy[l.id] || "";
          const priceStr = "price" in d ? d.price ?? "" : l.price?.toString() ?? "";
          const commentStr = "comment" in d ? d.comment ?? "" : l.comment ?? "";
          const datetimeStr = "datetime" in d ? d.datetime ?? "" : l.datetime ?? "";

          const wa = waLink(l.phone);
          const tg = tgLink(l.phone);
          const tel = l.phone ? `tel:${l.phone}` : null;

          const statusTone =
            l.status === "new"
              ? "new"
              : l.status === "in_progress"
              ? "work"
              : l.status === "done"
              ? "done"
              : "canceled";

          const flashCls =
            flash[l.id] === "ok"
              ? "ring-2 ring-emerald-400"
              : flash[l.id] === "err"
              ? "ring-2 ring-rose-400"
              : "";

          return (
            <div
              key={l.id}
              ref={setRef(l.id)}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-sm transition",
                "border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950",
                l.status === "new" && "border-zinc-900 dark:border-white",
                l.isDuplicate && "bg-rose-50/40 dark:bg-rose-950/10",
                flashCls
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold">#{l.id}</span>
                    <span className="font-semibold">{l.name}</span>
                    <button
                      onClick={() => copyPhone(l.phone)}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-900"
                      title="Скопировать телефон"
                    >
                      📋 <span className="truncate">{l.phone}</span>
                    </button>

                    <Badge tone={statusTone}>
                      {l.status === "new" ? "✨ " : l.status === "in_progress" ? "🟡 " : l.status === "done" ? "✅ " : "⛔ "}
                      {STATUS_LABEL[l.status]}
                    </Badge>

                    {l.isDuplicate && (
                      <span className="inline-flex items-center gap-2">
                        <Badge tone="dupe">🧬 Дубликат #{l.duplicateOfId ?? "—"}</Badge>
                        {l.duplicateOfId && (
                          <button
                            onClick={() => openLead(l.duplicateOfId!)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-900 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 dark:hover:bg-rose-950/50"
                          >
                            ↪ Открыть оригинал
                          </button>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                    <span className="truncate">
                      📍 {l.fromText} <span className="opacity-60">→</span> {l.toText}
                    </span>
                    {l.roundTrip && <Badge tone="neutral">🔁 туда-обратно</Badge>}
                    <Badge tone="neutral">🚗 {l.carClass}</Badge>
                  </div>

                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    🗓 {fmt(l.createdAt)}
                    {l.datetime ? ` • 🕒 ${l.datetime}` : ""}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tel && (
                      <a
                        href={tel}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                      >
                        📞 Позвонить
                      </a>
                    )}
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                    {tg && (
                      <a
                        href={tg}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/50"
                      >
                        ✈ Telegram
                      </a>
                    )}
                  </div>
                </div>

                <div className="w-full shrink-0 sm:w-[360px]">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-semibold">Управление</div>
                      {isBusy && (
                        <div className="inline-flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <Spinner className="h-4 w-4" />
                          Выполняем…
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Диспетчер
                        </label>
                        <select
                          value={l.assignedToId ?? ""}
                          onChange={(e) => {
                            const v = e.target.value === "" ? null : Number(e.target.value);
                            assignLead(l.id, v);
                          }}
                          disabled={isBusy}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
                        >
                          <option value="">— не назначен —</option>
                          {dispatchers.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Дата/время
                          </label>
                          <input
                            value={datetimeStr}
                            onChange={(e) =>
                              setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], datetime: e.target.value } }))
                            }
                            placeholder="20.01 14:00"
                            disabled={isBusy}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Цена (₽)
                          </label>
                          <input
                            value={priceStr}
                            onChange={(e) =>
                              setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], price: e.target.value } }))
                            }
                            placeholder="3500"
                            disabled={isBusy}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Комментарий диспетчера
                        </label>
                        <textarea
                          value={commentStr}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], comment: e.target.value } }))
                          }
                          placeholder="Детское кресло, багаж, встреча…"
                          disabled={isBusy}
                          className="min-h-[76px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => saveInline(l.id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                          {busyKey === "save" ? <Spinner className="h-4 w-4" /> : "💾"}
                          Сохранить
                        </button>

                        <button
                          onClick={() =>
                            setDraft((p) => {
                              const copy = { ...p };
                              delete copy[l.id];
                              return copy;
                            })
                          }
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        >
                          ↩ Отменить
                        </button>
                      </div>

                      <div className="mt-1 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => quickStatus(l.id, "in_progress")}
                          disabled={isBusy}
                          className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-60",
                            l.status === "in_progress"
                              ? "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200"
                              : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-950/25 dark:text-amber-200 dark:hover:bg-amber-950/40"
                          )}
                        >
                          {busyKey === "status:in_progress" ? <Spinner className="h-4 w-4" /> : "🟡"}
                          В работу
                        </button>

                        <button
                          onClick={() => quickStatus(l.id, "done")}
                          disabled={isBusy}
                          className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-60",
                            l.status === "done"
                              ? "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
                              : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/25 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                          )}
                        >
                          {busyKey === "status:done" ? <Spinner className="h-4 w-4" /> : "✅"}
                          Завершить
                        </button>

                        <button
                          onClick={() => quickStatus(l.id, "canceled")}
                          disabled={isBusy}
                          className={cn(
                            "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold disabled:opacity-60",
                            l.status === "canceled"
                              ? "border-rose-300 bg-rose-100 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
                              : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/25 dark:text-rose-200 dark:hover:bg-rose-950/40"
                          )}
                        >
                          {busyKey === "status:canceled" ? <Spinner className="h-4 w-4" /> : "⛔"}
                          Отменить
                        </button>
                      </div>

                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {flash[l.id] === "ok" ? "✅ Готово" : flash[l.id] === "err" ? "⚠ Ошибка" : " "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && leads.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Лидов нет.
          </div>
        )}
      </div>
    </div>
  );
}
