"use client";

import { useEffect, useMemo, useState } from "react";
import { Btn, Card, Field, Input, Select, SectionHeading, Badge, Spinner, Empty } from "../ui-kit";

type Row = {
  id: number;
  createdAt: string;
  ip: string | null;
  action: string;
  entity: string | null;
  entityId: number | null;
  actorId: number | null;
  actorEmail: string | null;
  details: any;
};

type Meta = { page: number; pageSize: number; total: number; pages: number };

function actionColor(action: string): "emerald" | "rose" | "amber" | "zinc" {
  if (action.toLowerCase().includes("delete") || action.toLowerCase().includes("cancel")) return "rose";
  if (action.toLowerCase().includes("create") || action.toLowerCase().includes("new")) return "emerald";
  if (action.toLowerCase().includes("update") || action.toLowerCase().includes("patch")) return "amber";
  return "zinc";
}

function fmt(s: string) {
  return new Date(s).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AuditClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: 50, total: 0, pages: 1 });
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [actorEmail, setActorEmail] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => { setPage(1); }, [action, entity, actorEmail, pageSize]);

  const qs = useMemo(() => {
    const sp = new URLSearchParams();
    if (action.trim()) sp.set("action", action.trim());
    if (entity.trim()) sp.set("entity", entity.trim());
    if (actorEmail.trim()) sp.set("actorEmail", actorEmail.trim());
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    return sp.toString();
  }, [action, entity, actorEmail, page, pageSize]);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/audit?${qs}`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) { setRows(data.rows || []); setMeta(data.meta || meta); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [qs]);

  return (
    <div>
      <SectionHeading
        title="Журнал аудита"
        subtitle={`${meta.total} записей`}
        action={
          <Btn variant="ghost" size="sm" onClick={load} loading={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : "↻"} Обновить
          </Btn>
        }
      />

      {/* Фильтры */}
      <Card className="mb-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Действие">
            <Input value={action} onChange={(e) => setAction(e.target.value)} placeholder="create, update, delete…" />
          </Field>
          <Field label="Сущность">
            <Input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Lead, User…" />
          </Field>
          <Field label="Оператор">
            <Input value={actorEmail} onChange={(e) => setActorEmail(e.target.value)} placeholder="email…" />
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Field label="Строк на странице" className="w-32">
            <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[25, 50, 100, 200].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </Field>
          <Btn variant="ghost" size="sm" onClick={() => { setAction(""); setEntity(""); setActorEmail(""); }}>
            Сбросить
          </Btn>
        </div>
      </Card>

      {/* Пагинация */}
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <Btn variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ← Пред.
        </Btn>
        <span>Стр. <strong>{meta.page}</strong> / {meta.pages} · Всего: {meta.total}</span>
        <Btn variant="ghost" size="sm" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
          След. →
        </Btn>
      </div>

      {/* Таблица */}
      {loading && rows.length === 0 ? (
        <div className="flex items-center gap-2 py-12 text-sm text-zinc-500"><Spinner className="h-5 w-5" /> Загружаем…</div>
      ) : rows.length === 0 ? (
        <Empty icon="📋" text="Записей аудита нет" />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  {["Время", "Действие", "Сущность", "Оператор", "IP", "Детали"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {fmt(r.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={actionColor(r.action)}>
                        {r.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">
                      {r.entity ? `${r.entity}${r.entityId ? ` #${r.entityId}` : ""}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 dark:text-zinc-300">
                      {r.actorEmail || (r.actorId ? `#${r.actorId}` : "—")}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{r.ip || "—"}</td>
                    <td className="px-4 py-3">
                      {r.details ? (
                        <button
                          onClick={() => setExpanded((p) => ({ ...p, [r.id]: !p[r.id] }))}
                          className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition underline underline-offset-2"
                        >
                          {expanded[r.id] ? "скрыть" : "показать"}
                        </button>
                      ) : "—"}
                      {expanded[r.id] && r.details && (
                        <pre className="mt-2 max-w-xs overflow-x-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                          {JSON.stringify(r.details, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
