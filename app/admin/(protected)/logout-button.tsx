"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setLoading(false);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
    >
      {loading ? "Выходим…" : "Выйти"}
    </button>
  );
}
