"use client";

import { useEffect, useMemo, useState } from "react";

type LeadStatus = "new" | "in_progress" | "done" | "canceled";

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
  status: LeadStatus;
  assignedToId: number | null;
  isDuplicate: boolean;
  duplicateOfId: number | null;
  createdAt: string;
};

const COLUMNS: Array<{ key: LeadStatus; title: string; icon: string }> = [
  { key: "new", title: "Новые", icon: "✨" },
  { key: "in_progress", title: "В работе", icon: "🟡" },
  { key: "done", title: "Завершены", icon: "✅" },
  { key: "canceled", title: "Отменены", icon: "⛔" },
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
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
function fmt(dt: string) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export default function LeadsClientKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const dispatchers = useMemo(
    () => users.filter((u) => u.role === "DISPATCHER" && u.isActive),
    [users]
  );
  const singleDispatcherId = dispatchers.length === 1 ? dispatchers[0].id : null;

  const [q, setQ] = useState("");
  const [onlyDupes, setOnlyDupes] = useState(false);
  const [loading, setLoading] = useState(false);

  // drag
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);

  // per-lead busy + small toast
  const [busy, setBusy] = useState<Record<number, string | null>>({});
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setUsers(data.users || []);
  }

  async function loadLeads() {
    setLoading(true);
    const sp = new URLSearchParams();
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

  async function assignLead(id: number, assignedToId: number | null) {
    setBusy((p) => ({ ...p, [id]: "assign" }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedToId } : l)));
    try {
      await patchLead(id, { assignedToId });
      showToast("Назначено ✅");
    } catch (e: any) {
      showToast("Ошибка ❌");
      await loadLeads();
      alert(e?.message || "Не удалось назначить");
    } finally {
      setBusy((p) => ({ ...p, [id]: null }));
    }
  }

  async function moveLead(id: number, next: LeadStatus) {
    setBusy((p) => ({ ...p, [id]: `move:${next}` }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)));
    try {
      await patchLead(id, { status: next });
      showToast("Статус обновлён ✅");
    } catch (e: any) {
      showToast("Ошибка ❌");
      await loadLeads();
      alert(e?.message || "Не удалось обновить статус");
    } finally {
      setBusy((p) => ({ ...p, [id]: null }));
    }
  }

  async function autoAssignIfNeeded(currentLeads: Lead[]) {
    if (!singleDispatcherId) return;
    const targets = currentLeads.filter((l) => l.status === "new" && !l.assignedToId);
    if (targets.length === 0) return;

    const batch = targets.slice(0, 15);
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
  }, [q, onlyDupes]);

  useEffect(() => {
    if (!loading && leads.length > 0) autoAssignIfNeeded(leads);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleDispatcherId, leads.length]);

  const grouped = useMemo(() => {
    const g: Record<LeadStatus, Lead[]> = { new: [], in_progress: [], done: [], canceled: [] };
    for (const l of leads) g[l.status].push(l);

    // сортировка внутри колонок: новые сверху по времени, остальные тоже
    for (const k of Object.keys(g) as LeadStatus[]) {
      g[k].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }
    return g;
  }, [leads]);

  function onDragStart(id: number) {
    setDragId(id);
  }

  function onDrop(col: LeadStatus) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    setOverCol(null);
    const current = leads.find((x) => x.id === id);
    if (!current) return;
    if (current.status === col) return;
    moveLead(id, col);
  }

  return (
    <div className="p-4">
      {/* header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Лиды — Канбан</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Перетаскивай карточки между колонками (Новые → В работе → …). Статус сохраняется сразу.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            {loading ? <Spinner /> : <span aria-hidden>↻</span>}
            {loading ? "Обновляем…" : "Обновить"}
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="mb-4 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-12">
        <div className="sm:col-span-8">
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

        <div className="sm:col-span-4">
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

      {/* kanban */}
      <div className="grid gap-3 lg:grid-cols-4">
        {COLUMNS.map((c) => {
          const items = grouped[c.key] || [];
          const isOver = overCol === c.key;

          return (
            <div
              key={c.key}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(c.key);
              }}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => onDrop(c.key)}
              className={cn(
                "rounded-2xl border p-3",
                "border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-950/40",
                isOver && "ring-2 ring-zinc-900 dark:ring-white"
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold">{c.title}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{items.length} шт.</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {items.map((l) => {
                  const b = busy[l.id] || "";
                  const isBusy = !!busy[l.id];

                  const wa = waLink(l.phone);
                  const tg = tgLink(l.phone);
                  const tel = l.phone ? `tel:${l.phone}` : null;

                  return (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={() => onDragStart(l.id)}
                      className={cn(
                        "group rounded-2xl border bg-white p-3 shadow-sm transition",
                        "border-zinc-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
                        l.isDuplicate && "bg-rose-50/40 dark:bg-rose-950/10",
                        dragId === l.id && "opacity-60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold">#{l.id}</span>
                            {l.isDuplicate && (
                              <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
                                🧬 дубль
                              </span>
                            )}
                            {l.roundTrip && (
                              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
                                🔁
                              </span>
                            )}
                          </div>

                          <div className="mt-1 truncate text-sm font-semibold">{l.name}</div>
                          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            📍 {l.fromText} → {l.toText}
                          </div>

                          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                            🗓 {fmt(l.createdAt)}
                            {l.datetime ? ` • 🕒 ${l.datetime}` : ""}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isBusy ? (
                            <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
                              <Spinner className="h-3.5 w-3.5" />
                              …
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigator.clipboard?.writeText(l.phone).catch(() => {})}
                          className="rounded-xl border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                          title="Скопировать телефон"
                        >
                          📋 {l.phone}
                        </button>
                        {tel && (
                          <a
                            href={tel}
                            className="rounded-xl border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                          >
                            📞
                          </a>
                        )}
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
                          >
                            💬
                          </a>
                        )}
                        {tg && (
                          <a
                            href={tg}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200 dark:hover:bg-sky-950/50"
                          >
                            ✈
                          </a>
                        )}
                      </div>

                      <div className="mt-3 grid gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                            Диспетчер
                          </label>
                          <select
                            value={l.assignedToId ?? ""}
                            onChange={(e) => {
                              const v = e.target.value === "" ? null : Number(e.target.value);
                              assignLead(l.id, v);
                            }}
                            disabled={isBusy}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-zinc-800"
                          >
                            <option value="">— не назначен —</option>
                            {dispatchers.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* quick buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => moveLead(l.id, "in_progress")}
                            disabled={isBusy}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-xs font-extrabold disabled:opacity-60",
                              l.status === "in_progress"
                                ? "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200"
                                : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-950/25 dark:text-amber-200 dark:hover:bg-amber-950/40"
                            )}
                            title="В работу"
                          >
                            {b === "move:in_progress" ? <Spinner className="mx-auto h-4 w-4" /> : "🟡"}
                          </button>

                          <button
                            onClick={() => moveLead(l.id, "done")}
                            disabled={isBusy}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-xs font-extrabold disabled:opacity-60",
                              l.status === "done"
                                ? "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200"
                                : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-950/25 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                            )}
                            title="Завершить"
                          >
                            {b === "move:done" ? <Spinner className="mx-auto h-4 w-4" /> : "✅"}
                          </button>

                          <button
                            onClick={() => moveLead(l.id, "canceled")}
                            disabled={isBusy}
                            className={cn(
                              "rounded-xl border px-2 py-2 text-xs font-extrabold disabled:opacity-60",
                              l.status === "canceled"
                                ? "border-rose-300 bg-rose-100 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
                                : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/25 dark:text-rose-200 dark:hover:bg-rose-950/40"
                            )}
                            title="Отменить"
                          >
                            {b === "move:canceled" ? <Spinner className="mx-auto h-4 w-4" /> : "⛔"}
                          </button>
                        </div>
                      </div>

                      {/* small footer */}
                      <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                        <div className="truncate">
                          {l.price != null ? `💰 ${l.price} ₽` : "💰 —"}
                        </div>
                        <div className="truncate">{l.comment ? "💬 есть" : "💬 —"}</div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-4 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-400">
                    Перетащи сюда лид
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {toast}
        </div>
      )}
    </div>
  );
}
