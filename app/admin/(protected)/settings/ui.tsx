"use client";

import { useEffect, useState } from "react";

type Settings = {
  brandName: string;
  brandTagline: string;
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  email: string | null;
  workHours: string | null;
  regionNote: string | null;
  companyName: string | null;
  inn: string | null;
  ogrn: string | null;
  address: string | null;
  notes: string | null;
};

const empty: Settings = {
  brandName: "Вектор РФ",
  brandTagline: "трансферы и поездки по России",
  phone: null,
  whatsapp: null,
  telegram: null,
  email: null,
  workHours: null,
  regionNote: null,
  companyName: null,
  inn: null,
  ogrn: null,
  address: null,
  notes: null,
};

export default function SettingsClient() {
  const [s, setS] = useState<Settings>(empty);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json().catch(() => ({}));
    setS(data.settings || empty);
    setLoading(false);
  }

  async function save() {
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(s),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok || !data.ok) {
      alert(data?.error || "Не удалось сохранить");
      return;
    }
    alert("Сохранено ✅");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  const inputStyle: React.CSSProperties = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    width: "100%",
  };

  const Field = (props: { label: string; value: any; onChange: (v: string) => void; placeholder?: string }) => (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>{props.label}</div>
      <input
        style={inputStyle}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    </div>
  );

  const TextArea = (props: { label: string; value: any; onChange: (v: string) => void; placeholder?: string }) => (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>{props.label}</div>
      <textarea
        style={{ ...inputStyle, minHeight: 90 }}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Настройки сайта</h1>

      <div style={{ display: "grid", gap: 12, background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <Field label="Название бренда" value={s.brandName} onChange={(v) => setS((p) => ({ ...p, brandName: v }))} />
        <Field label="Слоган" value={s.brandTagline} onChange={(v) => setS((p) => ({ ...p, brandTagline: v }))} />

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="Телефон" value={s.phone} onChange={(v) => setS((p) => ({ ...p, phone: v || null }))} />
          <Field label="Email" value={s.email} onChange={(v) => setS((p) => ({ ...p, email: v || null }))} />
          <Field label="WhatsApp" value={s.whatsapp} onChange={(v) => setS((p) => ({ ...p, whatsapp: v || null }))} />
          <Field label="Telegram" value={s.telegram} onChange={(v) => setS((p) => ({ ...p, telegram: v || null }))} />
        </div>

        <Field label="Часы работы" value={s.workHours} onChange={(v) => setS((p) => ({ ...p, workHours: v || null }))} />
        <Field label="Примечание по регионам" value={s.regionNote} onChange={(v) => setS((p) => ({ ...p, regionNote: v || null }))} />

        <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, marginTop: 6 }}>Реквизиты</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="Компания" value={s.companyName} onChange={(v) => setS((p) => ({ ...p, companyName: v || null }))} />
          <Field label="ИНН" value={s.inn} onChange={(v) => setS((p) => ({ ...p, inn: v || null }))} />
          <Field label="ОГРН" value={s.ogrn} onChange={(v) => setS((p) => ({ ...p, ogrn: v || null }))} />
          <Field label="Адрес" value={s.address} onChange={(v) => setS((p) => ({ ...p, address: v || null }))} />
        </div>

        <TextArea label="Примечания" value={s.notes} onChange={(v) => setS((p) => ({ ...p, notes: v || null }))} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={save} disabled={loading} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
            {loading ? "Сохраняем…" : "Сохранить"}
          </button>
          <button onClick={load} disabled={loading} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}>
            Обновить
          </button>
        </div>
      </div>
    </div>
  );
}
