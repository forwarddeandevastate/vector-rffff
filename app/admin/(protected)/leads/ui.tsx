"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "../toast";

/* ===================== types ===================== */

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

/* ===================== helpers ===================== */

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Завершён",
  canceled: "Отменён",
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

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
function telLink(phone: string) {
  return phone ? `tel:${phone}` : null;
}

/* ===================== component ===================== */

export default function LeadsClient() {
  const toast = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [q, setQ] = useState("");
  const [onlyDupes, setOnlyDupes] = useState(false);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<Record<number, boolean>>({});

  const dispatchers = useMemo(
    () => users.filter((u) => u.role === "DISPATCHER" && u.isActive),
    [users]
  );

  /* ===================== api ===================== */

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setUsers(data.users || []);
  }

  async function loadLeads() {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (status !== "all") sp.set("status", status);
      if (q.trim()) sp.set("q", q.trim());

      const res = await fetch(`/api/admin/leads?${sp.toString()}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error || "Ошибка загрузки");

      let rows: Lead[] = data.leads || [];
      if (onlyDupes) rows = rows.filter((x) => x.isDuplicate);
      setLeads(rows);
    } catch (e: any) {
      toast.error("Не удалось загрузить лиды", e?.message);
    } finally {
      setLoading(false);
    }
  }

  async function patchLead(id: number, patch: any) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка");
    return data.lead;
  }

  async function setLeadStatus(id: number, next: LeadStatus) {
    setBusy((p) => ({ ...p, [id]: true }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)));

    try {
      await patchLead(id, { status: next });
      toast.success("Статус обновлён", STATUS_LABEL[next]);
    } catch (e: any) {
      toast.error("Не удалось обновить статус", e?.message);
      loadLeads();
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  }

  async function assignLead(id: number, assignedToId: number | null) {
    setBusy((p) => ({ ...p, [id]: true }));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedToId } : l)));

    try {
      await patchLead(id, { assignedToId });
      toast.success("Назначение сохранено");
    } catch (e: any) {
      toast.error("Не удалось назначить", e?.message);
      loadLeads();
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  }

  /* ===================== effects ===================== */

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const t = setTimeout(loadLeads, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, onlyDupes]);

  /* ===================== render ===================== */

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Лиды</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Управление заявками и быстрые действия
          </p>
        </div>

        <button
          onClick={loadLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-60 dark:hover:bg-zinc-900"
        >
          {loading ? <Spinner /> : "↻"} Обновить
        </button>
      </div>

      {/* filters */}
      <div className="mb-4 grid gap-3 rounded-2xl border bg-white p-3 shadow-sm dark:bg-zinc-950 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="done">Завершённые</option>
            <option value="canceled">Отменённые</option>
          </select>
        </div>

        <div className="sm:col-span-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по имени, телефону, маршруту"
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyDupes}
            onChange={(e) => setOnlyDupes(e.target.checked)}
          />
          <span className="text-sm">Только дубликаты</span>
        </div>
      </div>

      {/* list */}
      <div className="grid gap-3">
        {leads.map((l) => {
          const wa = waLink(l.phone);
          const tel = telLink(l.phone);

          return (
            <div key={l.id} className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-950">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                #{l.id} {l.name}
                <span className="rounded-full border px-2 py-0.5 text-xs">
                  {STATUS_LABEL[l.status]}
                </span>
                {l.isDuplicate && (
                  <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs text-rose-800">
                    Дубликат
                  </span>
                )}
              </div>

              <div className="mt-1 text-sm">
                {l.fromText} → {l.toText}
              </div>

              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {fmt(l.createdAt)} {l.price ? `• ${l.price} ₽` : ""}
              </div>

              {l.comment && (
                <div className="mt-2 rounded-xl border bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
                  {l.comment}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {tel && <a href={tel} className="btn">Позвонить</a>}
                {wa && <a href={wa} target="_blank" className="btn">WhatsApp</a>}

                <select
                  value={l.assignedToId ?? ""}
                  onChange={(e) =>
                    assignLead(l.id, e.target.value ? Number(e.target.value) : null)
                  }
                  disabled={busy[l.id]}
                  className="rounded-xl border px-2 py-1 text-sm"
                >
                  <option value="">— не назначен —</option>
                  {dispatchers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <button onClick={() => setLeadStatus(l.id, "in_progress")} disabled={busy[l.id]}>
                  В работу
                </button>
                <button onClick={() => setLeadStatus(l.id, "done")} disabled={busy[l.id]}>
                  Завершить
                </button>
                <button onClick={() => setLeadStatus(l.id, "canceled")} disabled={busy[l.id]}>
                  Отменить
                </button>
              </div>
            </div>
          );
        })}

        {!loading && leads.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-sm dark:bg-zinc-950">
            Лидов нет
          </div>
        )}
      </div>
    </div>
  );
}
