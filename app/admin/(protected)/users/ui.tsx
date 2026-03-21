"use client";

import { useEffect, useState } from "react";
import { useToast } from "../toast";
import { Btn, Card, Field, Input, Badge, SectionHeading, Empty, Spinner, cn } from "../ui-kit";

type User = {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "DISPATCHER";
  isActive: boolean;
  createdAt: string;
};

function fmt(dt: string) {
  return new Date(dt).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsersClient() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setUsers(data.users || []);
    setLoading(false);
  }

  async function createDispatcher(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name || !password) { toast.error("Заполните все поля"); return; }
    setCreating(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, password, isActive: true }),
    });
    const data = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok || !data.ok) { toast.error("Не удалось создать", data?.error); return; }
    toast.success("Диспетчер создан", name);
    setEmail(""); setName(""); setPassword(""); setShowCreate(false);
    load();
  }

  async function toggleActive(u: User) {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) { toast.error("Не удалось обновить", data?.error); return; }
    toast.success(u.isActive ? "Диспетчер отключён" : "Диспетчер включён");
    load();
  }

  useEffect(() => { load(); }, []);

  const admins = users.filter((u) => u.role === "ADMIN");
  const dispatchers = users.filter((u) => u.role === "DISPATCHER");

  return (
    <div className="max-w-3xl">
      <SectionHeading
        title="Команда"
        subtitle="Администраторы и диспетчеры"
        action={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={load} loading={loading} size="sm">
              {loading ? <Spinner className="h-4 w-4" /> : "↻"} Обновить
            </Btn>
            <Btn variant="primary" onClick={() => setShowCreate((p) => !p)} size="sm">
              {showCreate ? "✕ Скрыть" : "+ Диспетчер"}
            </Btn>
          </div>
        }
      />

      {/* Форма создания */}
      {showCreate && (
        <Card className="mb-5">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Новый диспетчер
          </h2>
          <form onSubmit={createDispatcher} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Email">
                <Input type="email" placeholder="dispatcher@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Field>
              <Field label="Имя">
                <Input placeholder="Иван Петров" value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
            </div>
            <Field label="Пароль" hint="Минимум 8 символов">
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <div className="flex gap-2">
              <Btn variant="primary" type="submit" loading={creating}>Создать</Btn>
              <Btn variant="ghost" type="button" onClick={() => setShowCreate(false)}>Отмена</Btn>
            </div>
          </form>
        </Card>
      )}

      {/* Администраторы */}
      {admins.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Администраторы
          </h2>
          <div className="grid gap-3">
            {admins.map((u) => (
              <UserCard key={u.id} u={u} onToggle={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Диспетчеры */}
      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Диспетчеры ({dispatchers.length})
        </h2>
        {loading && dispatchers.length === 0 ? (
          <div className="flex items-center gap-2 py-6 text-sm text-zinc-500"><Spinner className="h-4 w-4" /> Загружаем…</div>
        ) : dispatchers.length === 0 ? (
          <Empty icon="👤" text="Диспетчеров нет. Создайте первого." />
        ) : (
          <div className="grid gap-3">
            {dispatchers.map((u) => (
              <UserCard key={u.id} u={u} onToggle={() => toggleActive(u)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ u, onToggle }: { u: { id: number; email: string; name: string; role: string; isActive: boolean; createdAt: string }; onToggle: () => void }) {
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm",
      u.isActive
        ? "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        : "border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40"
    )}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{u.name}</span>
          <Badge color={u.role === "ADMIN" ? "violet" : "sky"}>
            {u.role === "ADMIN" ? "Администратор" : "Диспетчер"}
          </Badge>
          <Badge color={u.isActive ? "emerald" : "rose"}>
            {u.isActive ? "Активен" : "Отключён"}
          </Badge>
        </div>
        <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{u.email}</div>
        <div className="mt-0.5 text-xs text-zinc-400">Создан {new Date(u.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })}</div>
      </div>
      {u.role !== "ADMIN" && (
        <Btn variant={u.isActive ? "danger" : "success"} size="sm" onClick={onToggle}>
          {u.isActive ? "Отключить" : "Включить"}
        </Btn>
      )}
    </div>
  );
}
