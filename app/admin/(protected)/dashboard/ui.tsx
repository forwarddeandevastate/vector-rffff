"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { StatCard, Card, Badge, Spinner, cn } from "../ui-kit";

type LeadStatus = "new" | "in_progress" | "done" | "canceled";

type Lead = {
  id: number;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  status: LeadStatus;
  createdAt: string;
  carClass: string;
};

type Stats = {
  total: number;
  new: number;
  in_progress: number;
  done: number;
  canceled: number;
  today: number;
  week: number;
};

const STATUS_COLOR: Record<LeadStatus, "zinc" | "amber" | "emerald" | "rose"> = {
  new: "zinc",
  in_progress: "amber",
  done: "emerald",
  canceled: "rose",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Завершён",
  canceled: "Отменён",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  new: "●",
  in_progress: "◐",
  done: "✓",
  canceled: "×",
};

function fmt(dt: string) {
  const d = new Date(dt);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return "только что";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} мин назад`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ч назад`;
  return d.toLocaleDateString("ru-RU");
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Один запрос — всё в одном: groupBy + recent
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        setStats(data.stats);
        setRecent(data.recent || []);
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000); // авто-обновление каждую минуту
    return () => clearInterval(t);
  }, [load]);

  const convRate =
    stats && stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div>
      {/* ── Заголовок ───────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Дашборд
          </h1>
          {lastUpdated && (
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Обновлено в {lastUpdated.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} · авто-обновление 1 мин
            </p>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <span aria-hidden>↻</span>}
          {loading ? "Загружаем…" : "Обновить"}
        </button>
      </div>

      {/* ── Статы ───────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Всего лидов" value={stats?.total ?? "—"} sub="за всё время" />
        <StatCard label="Сегодня" value={stats?.today ?? "—"} sub="новых заявок" accent="sky" />
        <StatCard label="За 7 дней" value={stats?.week ?? "—"} sub="новых заявок" accent="amber" />
        <StatCard label="Конверсия" value={stats ? `${convRate}%` : "—"} sub="завершённых к общим" accent="emerald" />
      </div>

      {/* ── Статусы ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {(["new", "in_progress", "done", "canceled"] as LeadStatus[]).map((s) => {
          const count = stats?.[s] ?? 0;
          const colors: Record<LeadStatus, { bar: string; bg: string }> = {
            new: { bar: "bg-zinc-900 dark:bg-white", bg: "bg-zinc-100 dark:bg-zinc-800" },
            in_progress: { bar: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
            done: { bar: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
            canceled: { bar: "bg-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
          };
          const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
          return (
            <Link
              key={s}
              href={`/admin/leads?status=${s}`}
              className={cn(
                "group rounded-2xl border border-zinc-200 p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800",
                colors[s].bg
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {STATUS_LABEL[s]}
                </span>
                <span className="text-lg" aria-hidden>{STATUS_DOT[s]}</span>
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{count}</div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className={cn("h-1.5 rounded-full transition-all", colors[s].bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{pct}% от всех</div>
            </Link>
          );
        })}
      </div>

      {/* ── Последние лиды ──────────────────────────────────── */}
      <Card padding={false}>
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
            Последние заявки
          </h2>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            Все лиды →
          </Link>
        </div>

        {loading && recent.length === 0 ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-zinc-500">
            <Spinner /> Загружаем…
          </div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">Лидов пока нет</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recent.map((l) => (
              <Link
                key={l.id}
                href={`/admin/leads/${l.id}`}
                className="flex flex-col gap-1.5 px-5 py-3.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">#{l.id}</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {l.name}
                    </span>
                    <Badge color={STATUS_COLOR[l.status]}>
                      {STATUS_DOT[l.status]} {STATUS_LABEL[l.status]}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {l.fromText} → {l.toText}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-zinc-400">{fmt(l.createdAt)}</div>
                  <div className="text-xs text-zinc-500">{l.carClass}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* ── Быстрые ссылки ──────────────────────────────────── */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/leads?status=new", label: "Новые заявки", icon: "📥", accent: "bg-zinc-900 text-white dark:bg-white dark:text-black" },
          { href: "/admin/reviews", label: "Отзывы на проверку", icon: "⭐", accent: "bg-amber-500 text-white" },
          { href: "/admin/settings", label: "Настройки", icon: "⚙️", accent: "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg shadow-sm", item.accent)}>
              {item.icon}
            </div>
            <span className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900 dark:text-zinc-200">
              {item.label}
            </span>
            <span className="ml-auto text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
