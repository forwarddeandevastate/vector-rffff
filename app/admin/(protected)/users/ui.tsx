"use client";

import { useEffect, useState } from "react";

type UserRow = {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "DISPATCHER";
  isActive: boolean;
  createdAt: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (data?.ok) setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createDispatcher(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setMsg(data?.error || "Create failed");
      return;
    }

    setUsers((prev) => [data.user, ...prev]);
    setEmail("");
    setName("");
    setPassword("");
    setMsg("Диспетчер создан ✅");
  }

  async function toggleActive(u: UserRow) {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      alert(data?.error || "Update failed");
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? data.user : x)));
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Users</h1>

      <form onSubmit={createDispatcher} style={{ display: "grid", gap: 10, marginBottom: 16, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        <div style={{ fontWeight: 700 }}>Create Dispatcher</div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />

        <button style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}>
          Create
        </button>

        {msg && <div style={{ padding: 10, borderRadius: 8, border: "1px solid #eee" }}>{msg}</div>}
      </form>

      <button onClick={load} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", marginBottom: 10 }}>
        {loading ? "Loading..." : "Reload"}
      </button>

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "Name", "Email", "Role", "Active", "Created", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{u.id}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{u.name}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{u.email}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{u.role}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>{u.isActive ? "✅" : "—"}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  {new Date(u.createdAt).toLocaleString("ru-RU")}
                </td>
                <td style={{ padding: 10, borderBottom: "1px solid #f3f3f3" }}>
                  {u.role === "ADMIN" ? (
                    <span style={{ opacity: 0.7 }}>—</span>
                  ) : (
                    <button
                      onClick={() => toggleActive(u)}
                      style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 12 }}>
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
