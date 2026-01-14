"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  datetime?: string | null;
  status: string;
  isDuplicate: boolean;
  duplicateOfId?: number | null;
  createdAt: string;
};

const STATUSES = ["all", "new", "in_progress", "done", "canceled"] as const;

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const q = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/admin/leads${q}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }

  async function update(id: number, patch: Partial<Lead>) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  useEffect(() => {
    load();
  }, [status]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Лиды</h1>

      {/* Фильтр */}
      <div style={{ marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "Все" : s}
            </option>
          ))}
        </select>
      </div>

      {loading && <div>Загрузка…</div>}

      <div style={{ display: "grid", gap: 12 }}>
        {leads.map((l) => (
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
                </div>
                {l.datetime && <div>🕒 {l.datetime}</div>}
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(l.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>
                  <b>{l.status}</b>
                </div>
                {l.isDuplicate && (
                  <div style={{ color: "red", fontSize: 12 }}>
                    Дубликат #{l.duplicateOfId}
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки */}
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => update(l.id, { status: "in_progress" })}>
                В работу
              </button>
              <button onClick={() => update(l.id, { status: "done" })}>Завершить</button>
              <button onClick={() => update(l.id, { status: "canceled" })}>Отменить</button>
            </div>
          </div>
        ))}

        {!loading && leads.length === 0 && <div>Лидов нет</div>}
      </div>
    </div>
  );
}
