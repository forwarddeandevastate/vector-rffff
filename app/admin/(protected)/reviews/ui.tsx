"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  name: string;
  rating: number | null;
  text: string;
  city: string | null;
  isPublic: boolean;
  createdAt: string;
  source: string | null;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function stars(rating: number | null) {
  const n = typeof rating === "number" && Number.isFinite(rating) ? Math.max(1, Math.min(5, Math.round(rating))) : 5;
  return "★".repeat(n);
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU");
  } catch {
    return iso;
  }
}

export default function ReviewsClient() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "public">("pending");

  const pendingCount = useMemo(() => items.filter((x) => !x.isPublic).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "pending") return items.filter((x) => !x.isPublic);
    if (filter === "public") return items.filter((x) => x.isPublic);
    return items;
  }, [items, filter]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || data?.error === "UNAUTHORIZED" || data?.error === "unauthorized") {
        throw new Error("Сессия админа истекла. Перезайдите в админку.");
      }

      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка загрузки");

      setItems(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (e: any) {
      setErr(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  async function setPublic(id: number, isPublic: boolean) {
    setErr(null);
    const ok = confirm(isPublic ? "Одобрить отзыв и показать на сайте?" : "Скрыть отзыв с сайта?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isPublic }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || data?.error === "UNAUTHORIZED" || data?.error === "unauthorized") {
        throw new Error("Сессия админа истекла. Перезайдите в админку.");
      }

      if (!res.ok || !data.ok) throw new Error(data?.error || "Не удалось сохранить");

      // локально обновляем без лишней перезагрузки
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isPublic } : x)));
    } catch (e: any) {
      setErr(e?.message || "Ошибка");
    }
  }

  async function remove(id: number) {
    setErr(null);
    if (!confirm("Удалить отзыв? Это действие нельзя отменить.")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || data?.error === "UNAUTHORIZED" || data?.error === "unauthorized") {
        throw new Error("Сессия админа истекла. Перезайдите в админку.");
      }

      if (!res.ok || !data.ok) throw new Error(data?.error || "Не удалось удалить");

      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setErr(e?.message || "Ошибка");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-zinc-900">Отзывы</div>
          <div className="mt-1 text-sm text-zinc-600">
            На сайте показываются только одобренные. В ожидании: <b>{pendingCount}</b>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800"
            aria-label="Фильтр отзывов"
          >
            <option value="pending">На модерации</option>
            <option value="public">Опубликованные</option>
            <option value="all">Все</option>
          </select>

          <button
            onClick={load}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            Обновить
          </button>
        </div>
      </div>

      {loading ? <div className="mt-6 text-sm text-zinc-600">Загрузка…</div> : null}
      {err ? (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{err}</div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-bold text-zinc-900">{r.name}</div>
                  {r.city ? <div className="text-sm text-zinc-500">• {r.city}</div> : null}
                  <div className="text-xs text-zinc-400">• {fmtDate(r.createdAt)}</div>
                </div>

                <div className="mt-1 text-sm text-zinc-700">
                  {stars(r.rating)}{" "}
                  <span className="text-zinc-400">({typeof r.rating === "number" ? r.rating : "—"}/5)</span>
                </div>

                <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{r.text}</div>
              </div>

              <div className="flex flex-none flex-col gap-2">
                {r.isPublic ? (
                  <button
                    onClick={() => setPublic(r.id, false)}
                    className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                  >
                    Скрыть
                  </button>
                ) : (
                  <button
                    onClick={() => setPublic(r.id, true)}
                    className="h-9 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-3 text-sm font-extrabold text-white hover:opacity-95"
                  >
                    Одобрить
                  </button>
                )}

                <button
                  onClick={() => remove(r.id)}
                  className="h-9 rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-900 hover:bg-rose-100"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-zinc-400">
              ID: {r.id} • source: {r.source || "—"} • public: {r.isPublic ? "yes" : "no"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
