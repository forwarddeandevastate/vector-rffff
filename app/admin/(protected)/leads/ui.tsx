"use client";

import { useEffect, useMemo, useState } from "react";

type Dispatcher = { id: number; name: string; email: string };
type Lead = {
  id: number;
  createdAt: string;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  carClass: string;
  roundTrip: boolean;
  price: number | null;
  status: string;
  isDuplicate: boolean;
  duplicateOfId: number | null;
  assignedToId: number | null;
  assignedTo: Dispatcher | null;
};

type Meta = { page: number; pageSize: number; total: number; pages: number };

const STATUSES = ["all", "new", "in_progress", "done", "canceled"] as const;

function useDebounced<T>(value: T, delayMs: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

export default function LeadsClient() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [q, setQ] = useState("");
  const qDebounced = useDebounced(q, 400);

  const [unassigned, setUnassigned] = useState(false);
  const [duplicates, setDuplicates] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: 50, total: 0, pages: 1 });

  // если поменяли фильтры — сбрасываем страницу на 1
  useEffect(() => {
    setPage(1);
  }, [status, qDebounced, unassigned, duplicates, pageSize]);

  const qs = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("status", status);
    if (qDebounced.trim()) sp.set("q", qDebounced.trim());
    if (unassigned) sp.set("unassigned", "1");
    if (duplicates) sp.set("duplicates", "1");
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));
    return sp.toString();
  }, [status, qDebounced, unassigned, duplicates, page, pageSize]);

  async function load() {
    setLoading(true);

    const [lRes, dRes] = await Promise.all([
      fetch(`/api/admin/leads?${qs}`, { cache: "no-store" }),
      fetch(`/api/admin/dispatchers`, { cache: "no-store" }),
    ]);

    const lData = await lRes.json().catch(() => ({}));
    const dData = await dRes.json().catch(() => ({}));

    if (lData?.ok) {
      setLeads(lData.leads || []);
      setMeta(lData.meta || { page, pageSize, total: 0, pages: 1 });
    } else if (!lRes.ok) {
      alert(lData?.error || "Failed to load leads");
    }

    if (dData?.ok) setDispatchers(dData.users || []);

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  async function patchLead(id: number, body: any) {
    // оптимистично обновим локально (чтобы было быстро)
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;

        const next: any = { ...l, ...body };
        // assignedTo объект подтянем по dispatchers
        if ("assignedToId" in body) {
          const v = body.assignedToId;
          next.assignedToId = v;
          next.assignedTo = v ? dispatchers.find((d) => d.id === v) ?? null : null;
        }
        if ("isDuplicate" in body && body.isDuplicate === false) {
          next.duplicateOfId = null;
        }
        return next;
      })
    );

    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      alert(data?.error || "Update failed");
      // если ошибка — перезагрузим список, чтобы вернуть корректное состояние
      load();
      return;
    }

    // “истина” от сервера
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data.lead } : l))
    );
  }

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.pages;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Leads</h1>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={unassigned} onChange={(e) => setUnassigned(e.target.checked)} />
          <span>Unassigned</span>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={duplicates} onChange={(e) => setDuplicates(e.target.checked)} />
          <span>Duplicates</span>
        </label>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name / phone..."
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", minWidth: 240 }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Page size:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <button
          onClick={load}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Reload"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <button
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: canPrev ? "pointer" : "not-allowed" }}
        >
          Prev
        </button>

        <div style={{ opacity: 0.8 }}>
          Page <b>{meta.page}</b> / {meta.pages} — Total: {meta.total}
        </div>

        <button
          disabled={!canNext}
          onClick={() => setPage((p) => p + 1)}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: canNext ? "pointer" : "not-allowed" }}
        >
          Next
        </button>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Created", "Name/Phone", "Route", "Car", "Price", "Status", "Assigned", "Duplicate", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3", whiteSpace: "nowrap" }}>
                  {new Date(l.createdAt).toLocaleString("ru-RU")}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  <div style={{ fontWeight: 700 }}>{l.name}</div>
                  <div style={{ opacity: 0.8 }}>{l.phone}</div>
                  <a href={`/admin/leads/${l.id}`} style={{ opacity: 0.7, fontSize: 12, textDecoration: "underline" }}>
  #{l.id} открыть →
</a>

                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  {l.fromText} → {l.toText}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  {l.carClass}{l.roundTrip ? " (RT)" : ""}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  {l.price ?? "-"}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  <select
                    value={l.status}
                    onChange={(e) => patchLead(l.id, { status: e.target.value })}
                    style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                  >
                    <option value="new">new</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                    <option value="canceled">canceled</option>
                  </select>
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  <select
                    value={l.assignedToId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      patchLead(l.id, { assignedToId: v ? Number(v) : null });
                    }}
                    style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", minWidth: 220 }}
                  >
                    <option value="">— unassigned —</option>
                    {dispatchers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.email})
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={l.isDuplicate}
                      onChange={(e) => patchLead(l.id, { isDuplicate: e.target.checked })}
                    />
                    duplicate
                  </label>
                  {l.isDuplicate && (
                    <div style={{ marginTop: 6 }}>
                      <input
                        placeholder="duplicateOfId"
                        defaultValue={l.duplicateOfId ?? ""}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          patchLead(l.id, { duplicateOfId: v ? Number(v) : null });
                        }}
                        style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", width: 160 }}
                      />
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                        (впиши ID оригинала и выйди из поля)
                      </div>
                    </div>
                  )}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => patchLead(l.id, { status: "in_progress" })}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", marginRight: 6 }}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => patchLead(l.id, { status: "done" })}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", marginRight: 6 }}
                  >
                    Done
                  </button>
                  <button
                    onClick={() => patchLead(l.id, { status: "canceled" })}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 12 }}>
                  Лидов не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
