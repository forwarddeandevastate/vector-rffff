"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [status, setStatus] = useState<"all" | Lead["status"]>("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // локальные правки по leadId
  const [draft, setDraft] = useState<Record<number, { price?: string; comment?: string; datetime?: string }>>({});

  const dispatchers = useMemo(
    () => users.filter((u) => u.role === "DISPATCHER" && u.isActive),
    [users]
  );

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
    setLeads(data.leads || []);
    setLoading(false);
  }

  async function patchLead(id: number, patch: any) {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      alert(data?.error || "Ошибка сохранения");
      return false;
    }
    return true;
  }

  async function quickStatus(id: number, next: Lead["status"]) {
    const ok = await patchLead(id, { status: next });
    if (ok) loadLeads();
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

    const ok = await patchLead(id, patch);
    if (ok) {
      setDraft((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      loadLeads();
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // легкий “debounce” для поиска
  useEffect(() => {
    const t = setTimeout(() => loadLeads(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Лиды</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: телефон / имя / откуда / куда"
          style={{ minWidth: 320, padding: "6px 10px" }}
        />

        <button onClick={loadLeads} disabled={loading}>
          {loading ? "Обновляем..." : "Обновить"}
        </button>
      </div>

      {loading && <div>Загрузка…</div>}

      <div style={{ display: "grid", gap: 12 }}>
        {leads.map((l) => {
          const d = draft[l.id] || {};
          const priceStr = "price" in d ? d.price ?? "" : l.price?.toString() ?? "";
          const commentStr = "comment" in d ? d.comment ?? "" : l.comment ?? "";
          const datetimeStr = "datetime" in d ? d.datetime ?? "" : l.datetime ?? "";

          return (
            <div
              key={l.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                background: l.isDuplicate ? "#fff6f6" : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <b>#{l.id}</b> — {l.name} ({l.phone})
                  <div>
                    {l.fromText} → {l.toText}
                    {l.roundTrip ? " (туда-обратно)" : ""}
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.7 }}>{fmt(l.createdAt)}</div>

                  {l.isDuplicate && (
                    <div style={{ color: "crimson", fontSize: 12 }}>
                      Дубликат. Оригинал: #{l.duplicateOfId ?? "—"}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div>
                    <b>{STATUS_LABEL[l.status]}</b>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{l.carClass}</div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {/* Назначение диспетчера */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>Диспетчер:</span>
                  <select
                    value={l.assignedToId ?? ""}
                    onChange={async (e) => {
                      const v = e.target.value === "" ? null : Number(e.target.value);
                      const ok = await patchLead(l.id, { assignedToId: v });
                      if (ok) loadLeads();
                    }}
                  >
                    <option value="">— не назначен —</option>
                    {dispatchers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inline редактирование */}
                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Дата/время</div>
                    <input
                      value={datetimeStr}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], datetime: e.target.value } }))
                      }
                      placeholder="например 20.01 14:00"
                      style={{ width: "100%", padding: "6px 10px" }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Цена (₽)</div>
                    <input
                      value={priceStr}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], price: e.target.value } }))
                      }
                      placeholder="например 3500"
                      style={{ width: "100%", padding: "6px 10px" }}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Комментарий</div>
                    <textarea
                      value={commentStr}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, [l.id]: { ...p[l.id], comment: e.target.value } }))
                      }
                      placeholder="Комментарий диспетчера"
                      style={{ width: "100%", padding: "6px 10px", minHeight: 70 }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => saveInline(l.id)}>Сохранить</button>
                    <button
                      onClick={() =>
                        setDraft((p) => {
                          const copy = { ...p };
                          delete copy[l.id];
                          return copy;
                        })
                      }
                    >
                      Отменить правки
                    </button>
                  </div>
                </div>

                {/* Быстрые статусы */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => quickStatus(l.id, "in_progress")}>В работу</button>
                  <button onClick={() => quickStatus(l.id, "done")}>Завершить</button>
                  <button onClick={() => quickStatus(l.id, "canceled")}>Отменить</button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && leads.length === 0 && <div>Лидов нет</div>}
      </div>
    </div>
  );
}
