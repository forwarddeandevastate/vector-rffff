"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "../toast";
import { Btn, Card, Badge, Field, Textarea, Input, SectionHeading, Empty, Spinner, cn } from "../ui-kit";

type Review = {
  id: number;
  name: string;
  rating: number | null;
  text: string;
  city: string | null;
  isPublic: boolean;
  createdAt: string;
  source: string | null;
  replyText?: string | null;
  replyAuthor?: string | null;
  repliedAt?: string | null;
};

function Stars({ n }: { n: number }) {
  const clamped = Math.max(1, Math.min(5, Math.round(n)));
  return (
    <span className="text-amber-400 tracking-tighter" aria-label={`${clamped} из 5`}>
      {"★".repeat(clamped)}{"☆".repeat(5 - clamped)}
    </span>
  );
}

function fmt(s: string) {
  return new Date(s).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ReviewsClient() {
  const toast = useToast();
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "public" | "all">("pending");

  const [drafts, setDrafts] = useState<Record<number, { text: string; author: string }>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  const pending = useMemo(() => items.filter((x) => !x.isPublic).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "pending") return items.filter((x) => !x.isPublic);
    if (filter === "public") return items.filter((x) => x.isPublic);
    return items;
  }, [items, filter]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) setItems(data.reviews || []);
    setLoading(false);
  }

  function getDraft(r: Review) {
    return drafts[r.id] ?? { text: r.replyText ?? "", author: r.replyAuthor ?? "" };
  }

  function setDraft(id: number, key: "text" | "author", val: string) {
    setDrafts((p) => ({ ...p, [id]: { ...getDraft(items.find((x) => x.id === id)!), [key]: val } }));
  }

  async function patchReview(id: number, body: any) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка");
    return data.review;
  }

  async function publish(r: Review) {
    setSaving((p) => ({ ...p, [r.id]: true }));
    try {
      await patchReview(r.id, { isPublic: true });
      setItems((p) => p.map((x) => x.id === r.id ? { ...x, isPublic: true } : x));
      toast.success("Отзыв опубликован");
    } catch (e: any) { toast.error("Ошибка", e?.message); }
    setSaving((p) => ({ ...p, [r.id]: false }));
  }

  async function unpublish(r: Review) {
    setSaving((p) => ({ ...p, [r.id]: true }));
    try {
      await patchReview(r.id, { isPublic: false });
      setItems((p) => p.map((x) => x.id === r.id ? { ...x, isPublic: false } : x));
      toast.success("Отзыв скрыт");
    } catch (e: any) { toast.error("Ошибка", e?.message); }
    setSaving((p) => ({ ...p, [r.id]: false }));
  }

  async function saveReply(r: Review) {
    const d = getDraft(r);
    setSaving((p) => ({ ...p, [r.id]: true }));
    try {
      const updated = await patchReview(r.id, { replyText: d.text || null, replyAuthor: d.author || null });
      setItems((p) => p.map((x) => x.id === r.id ? { ...x, ...updated } : x));
      toast.success("Ответ сохранён");
    } catch (e: any) { toast.error("Ошибка", e?.message); }
    setSaving((p) => ({ ...p, [r.id]: false }));
  }

  async function deleteReview(r: Review) {
    if (!window.confirm(`Удалить отзыв от ${r.name}?`)) return;
    setSaving((p) => ({ ...p, [r.id]: true }));
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка");
      setItems((p) => p.filter((x) => x.id !== r.id));
      toast.success("Отзыв удалён");
    } catch (e: any) { toast.error("Ошибка", e?.message); }
    setSaving((p) => ({ ...p, [r.id]: false }));
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <SectionHeading
        title="Отзывы"
        subtitle={pending > 0 ? `${pending} ожидают модерации` : "Все отзывы проверены"}
        action={
          <Btn variant="ghost" size="sm" onClick={load} loading={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : "↻"} Обновить
          </Btn>
        }
      />

      {/* Фильтр */}
      <div className="mb-5 flex gap-2">
        {([["pending", "На проверке"], ["public", "Опубликованные"], ["all", "Все"]] as const).map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm font-semibold transition",
              filter === v
                ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            )}>
            {label}
            {v === "pending" && pending > 0 && (
              <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center gap-2 py-12 text-sm text-zinc-500"><Spinner className="h-5 w-5" /> Загружаем…</div>
      ) : filtered.length === 0 ? (
        <Empty icon="⭐" text={filter === "pending" ? "Нет отзывов на модерации" : "Отзывов нет"} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => {
            const draft = getDraft(r);
            const busy = !!saving[r.id];
            return (
              <Card key={r.id}>
                {/* Шапка */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{r.name}</span>
                      {r.city && <span className="text-xs text-zinc-400">{r.city}</span>}
                      <Badge color={r.isPublic ? "emerald" : "amber"}>
                        {r.isPublic ? "Опубликован" : "На модерации"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {r.rating != null && <Stars n={r.rating} />}
                      <span className="text-xs text-zinc-400">{fmt(r.createdAt)}</span>
                      {r.source && <span className="text-xs text-zinc-400">· {r.source}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {r.isPublic
                      ? <Btn variant="warning" size="sm" disabled={busy} onClick={() => unpublish(r)}>Скрыть</Btn>
                      : <Btn variant="success" size="sm" disabled={busy} onClick={() => publish(r)}>Опубликовать</Btn>
                    }
                    <Btn variant="danger" size="sm" disabled={busy} onClick={() => deleteReview(r)}>Удалить</Btn>
                  </div>
                </div>

                {/* Текст */}
                <div className="mb-4 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
                  {r.text}
                </div>

                {/* Ответ */}
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Ответ от администрации
                    {r.repliedAt && <span className="ml-2 font-normal normal-case">· {fmt(r.repliedAt)}</span>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
                    <Textarea
                      placeholder="Введите ответ (необязательно)…"
                      rows={2}
                      value={draft.text}
                      onChange={(e) => setDraft(r.id, "text", e.target.value)}
                    />
                    <div className="grid gap-2">
                      <Input
                        placeholder="Автор ответа"
                        value={draft.author}
                        onChange={(e) => setDraft(r.id, "author", e.target.value)}
                      />
                      <Btn variant="primary" size="sm" disabled={busy} loading={busy} onClick={() => saveReply(r)}>
                        Сохранить
                      </Btn>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
