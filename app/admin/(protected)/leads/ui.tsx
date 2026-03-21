"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useToast } from "../toast";
import { Btn, Badge, Card, Select, Empty, Spinner, SectionHeading, Input, cn } from "../ui-kit";

type LeadStatus = "new" | "in_progress" | "done" | "canceled";

type User = { id: number; name: string; role: "ADMIN" | "DISPATCHER"; isActive: boolean };

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

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новый", in_progress: "В работе", done: "Завершён", canceled: "Отменён",
};
const STATUS_COLOR: Record<LeadStatus, "zinc" | "amber" | "emerald" | "rose"> = {
  new: "zinc", in_progress: "amber", done: "emerald", canceled: "rose",
};
const STATUS_DOT: Record<LeadStatus, string> = {
  new: "●", in_progress: "◐", done: "✓", canceled: "×",
};

function fmtDate(dt: string) {
  const d = new Date(dt);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "только что";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} мин`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ч`;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function digitsOnly(s: string) { return (s || "").replace(/\D/g, ""); }

function PhoneActions({ phone }: { phone: string }) {
  const digits = digitsOnly(phone);
  const toast = useToast();
  if (!digits) return <span className="text-sm font-mono text-zinc-600">{phone}</span>;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => navigator.clipboard?.writeText(phone).then(() => toast.success("Скопировано"))}
        className="font-mono text-sm text-zinc-800 hover:text-zinc-600 dark:text-zinc-200 transition-colors"
        title="Копировать"
      >
        {phone}
      </button>
      <a href={`tel:${phone}`} className="rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors">
        Позвонить
      </a>
      <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200 transition-colors">
        WA
      </a>
      <a href={`tg://resolve?phone=${digits}`} target="_blank" rel="noreferrer"
        className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200 transition-colors">
        TG
      </a>
    </div>
  );
}

function LeadCard({
  lead, dispatchers, busy, onStatus, onAssign,
}: {
  lead: Lead;
  dispatchers: User[];
  busy: boolean;
  onStatus: (id: number, s: LeadStatus) => void;
  onAssign: (id: number, uid: number | null) => void;
}) {
  return (
    <div className={cn(
      "rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-950",
      lead.isDuplicate
        ? "border-rose-200 dark:border-rose-900/40"
        : "border-zinc-200 dark:border-zinc-800"
    )}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:gap-5">
        {/* ── Left info ──────────────────────────────── */}
        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-zinc-400">#{lead.id}</span>
            <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{lead.name}</span>
            <Badge color={STATUS_COLOR[lead.status]}>
              {STATUS_DOT[lead.status]} {STATUS_LABEL[lead.status]}
            </Badge>
            {lead.isDuplicate && (
              <Badge color="rose">Дубль #{lead.duplicateOfId ?? "—"}</Badge>
            )}
            {lead.roundTrip && <Badge color="sky">↔ Туда-обратно</Badge>}
          </div>

          {/* Route */}
          <div className="mb-1 flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.fromText}</span>
            <span className="text-zinc-400">→</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{lead.toText}</span>
          </div>

          {/* Meta */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{lead.carClass}</span>
            {lead.datetime && <><span>·</span><span>🕒 {lead.datetime}</span></>}
            {lead.price != null && <><span>·</span><span className="font-semibold text-zinc-700 dark:text-zinc-300">{lead.price.toLocaleString("ru-RU")} ₽</span></>}
            <span>·</span>
            <span>{fmtDate(lead.createdAt)}</span>
          </div>

          {/* Comment */}
          {lead.comment && (
            <div className="mb-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
              {lead.comment}
            </div>
          )}

          {/* Phone */}
          <PhoneActions phone={lead.phone} />
        </div>

        {/* ── Right actions ───────────────────────────── */}
        <div className="w-full shrink-0 sm:w-[300px]">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Действия
              </span>
              {busy && (
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Spinner className="h-3 w-3" /> сохраняем…
                </span>
              )}
            </div>

            {/* Dispatcher */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Диспетчер</label>
              <Select
                value={lead.assignedToId ?? ""}
                onChange={(e) => onAssign(lead.id, e.target.value ? Number(e.target.value) : null)}
                disabled={busy}
              >
                <option value="">— не назначен —</option>
                {dispatchers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>
            </div>

            {/* Status buttons */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <Btn variant="warning" size="sm" disabled={busy}
                onClick={() => onStatus(lead.id, "in_progress")}>
                В работу
              </Btn>
              <Btn variant="success" size="sm" disabled={busy}
                onClick={() => onStatus(lead.id, "done")}>
                Готово
              </Btn>
              <Btn variant="danger" size="sm" disabled={busy}
                onClick={() => onStatus(lead.id, "canceled")}>
                Отмена
              </Btn>
            </div>

            {/* Open detail */}
            <Link href={`/admin/leads/${lead.id}`}
              className="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200">
              Открыть детально →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsClient() {
  const toast = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [q, setQ] = useState("");
  const [onlyDupes, setOnlyDupes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<Record<number, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  const dispatchers = useMemo(
    () => users.filter((u) => u.role === "DISPATCHER" && u.isActive),
    [users]
  );

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setUsers(data.users || []);
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (status !== "all") sp.set("status", status);
      if (q.trim()) sp.set("q", q.trim());

      const res = await fetch(`/api/admin/leads?${sp}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Ошибка");

      let rows: Lead[] = data.leads || [];
      if (onlyDupes) rows = rows.filter((x) => x.isDuplicate);
      setLeads(rows);
    } catch (e: any) {
      toast.error("Не удалось загрузить", e?.message);
    } finally {
      setLoading(false);
    }
  }, [status, q, onlyDupes, toast]);

  async function patchLead(id: number, patch: object) {
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
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: next } : l));
    try {
      await patchLead(id, { status: next });
      toast.success("Статус: " + STATUS_LABEL[next]);
    } catch (e: any) {
      toast.error("Ошибка", e?.message);
      loadLeads();
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  }

  async function assignLead(id: number, assignedToId: number | null) {
    setBusy((p) => ({ ...p, [id]: true }));
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, assignedToId } : l));
    try {
      await patchLead(id, { assignedToId });
      toast.success("Диспетчер назначен");
    } catch (e: any) {
      toast.error("Ошибка", e?.message);
      loadLeads();
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  }

  // Keyboard shortcut: Ctrl+K = фокус поиска
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    const t = setTimeout(loadLeads, 250);
    return () => clearTimeout(t);
  }, [loadLeads]);

  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div>
      <SectionHeading
        title={`Лиды${newCount > 0 ? ` · ${newCount} новых` : ""}`}
        subtitle={`Показано: ${leads.length}`}
        action={
          <Btn variant="ghost" onClick={loadLeads} loading={loading} size="sm">
            {loading ? <Spinner className="h-4 w-4" /> : "↻"} Обновить
          </Btn>
        }
      />

      {/* ── Фильтры ──────────────────────────────────────────── */}
      <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-3 sm:grid-cols-12">
          {/* Статус */}
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">Статус</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="all">Все</option>
              <option value="new">Новые</option>
              <option value="in_progress">В работе</option>
              <option value="done">Завершённые</option>
              <option value="canceled">Отменённые</option>
            </Select>
          </div>

          {/* Поиск */}
          <div className="sm:col-span-7">
            <label className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Поиск <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 text-[10px] dark:border-zinc-700 dark:bg-zinc-800">⌘K</kbd>
            </label>
            <Input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Телефон, имя, откуда, куда…"
            />
          </div>

          {/* Дубликаты */}
          <div className="sm:col-span-2 flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              <input
                type="checkbox"
                checked={onlyDupes}
                onChange={(e) => setOnlyDupes(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Дубли</span>
            </label>
          </div>
        </div>

        {/* Status quick-filter pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["all", "new", "in_progress", "done", "canceled"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                status === s
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                  : "border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
              )}>
              {s === "all" ? "Все" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Список ───────────────────────────────────────────── */}
      {loading && leads.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
          <Spinner className="h-5 w-5" /> Загружаем…
        </div>
      ) : leads.length === 0 ? (
        <Empty icon="📭" text="Лидов нет" />
      ) : (
        <div className="grid gap-3">
          {leads.map((l) => (
            <LeadCard
              key={l.id}
              lead={l}
              dispatchers={dispatchers}
              busy={!!busy[l.id]}
              onStatus={setLeadStatus}
              onAssign={assignLead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
