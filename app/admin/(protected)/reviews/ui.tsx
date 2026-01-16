"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  name: string;
  rating: number;
  text: string;
  city: string | null;
  isPublic: boolean;
  createdAt: string;
  source: string | null;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ReviewsClient() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const pending = useMemo(() => items.filter((x) => !x.isPublic), [items]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка загрузки");
      setItems(data.reviews);
    } catch (e: any) {
      setErr(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  async function setPublic(id: number, isPublic: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isPublic }),
    });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("Удалить отзыв?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await load();
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
            На сайте показываются только одобренные. В ожидании: <b>{pending.length}</b>
          </div>
        </div>

        <button
          onClick={load}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          Обновить
        </button>
      </div>

      {loading ? <div className="mt-6 text-sm text-zinc-600">Загрузка…</div> : null}
      {err ? (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{err}</div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-bold text-zinc-900">{r.name}</div>
                  <div className="text-sm text-zinc-500">{r.city ? `• ${r.city}` : ""}</div>
                  <div className="text-xs text-zinc-400">• {new Date(r.createdAt).toLocaleString()}</div>
                </div>

                <div className="mt-1 text-sm text-zinc-700">
                  {"★".repeat(Math.max(1, Math.min(5, r.rating)))}{" "}
                  <span className="text-zinc-400">({r.rating}/5)</span>
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
