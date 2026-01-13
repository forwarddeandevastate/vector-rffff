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

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/site-settings");
      const data = await res.json();
      if (data?.ok) setS(data.settings);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(s),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setMsg(data?.error || "Save failed");
      return;
    }
    setS(data.settings);
    setMsg("Сохранено ✅");
  }

  if (!s) return <div>Loading...</div>;

  const input = (key: keyof Settings, label: string) => (
    <label style={{ display: "grid", gap: 6 }}>
      <span>{label}</span>
      <input
        value={(s[key] ?? "") as string}
        onChange={(e) => setS({ ...s, [key]: e.target.value })}
        style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
      />
    </label>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Site Settings</h1>

      <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
        {input("brandName", "Brand name")}
        {input("brandTagline", "Brand tagline")}
        {input("phone", "Phone")}
        {input("whatsapp", "WhatsApp")}
        {input("telegram", "Telegram")}
        {input("email", "Email")}
        {input("workHours", "Work hours")}
        {input("regionNote", "Region note")}
        {input("companyName", "Company name")}
        {input("inn", "INN")}
        {input("ogrn", "OGRN")}
        {input("address", "Address")}
        {input("notes", "Notes")}

        <button style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}>
          Save
        </button>

        {msg && <div style={{ padding: 10, border: "1px solid #eee", borderRadius: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
