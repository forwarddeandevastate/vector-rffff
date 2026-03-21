"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../../toast";
import {
  Btn, Badge, Card, Field, Input, Select, Spinner, Textarea, cn,
} from "../../ui-kit";

type LeadStatus = "new" | "in_progress" | "done" | "canceled";

type Dispatcher = { id: number; name: string; email: string };

type Lead = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  fromText: string;
  toText: string;
  pickupAddress: string | null;
  dropoffAddress: string | null;
  datetime: string | null;
  carClass: string;
  roundTrip: boolean;
  price: number | null;
  comment: string | null;
  status: LeadStatus;
  assignedToId: number | null;
  assignedTo: Dispatcher | null;
  isDuplicate: boolean;
  duplicateOfId: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Завершён",
  canceled: "Отменён",
};

const STATUS_COLOR: Record<LeadStatus, "zinc" | "amber" | "emerald" | "rose"> = {
  new: "zinc",
  in_progress: "amber",
  done: "emerald",
  canceled: "rose",
};

function dt(s: string) {
  return new Date(s).toLocaleString("ru-RU", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function digitsOnly(s: string) { return (s || "").replace(/\D/g, ""); }

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5 border-b border-zinc-100 last:border-0 dark:border-zinc-800">
      <dt className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide self-start pt-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100 break-words">{children}</dd>
    </div>
  );
}

export default function LeadDetailClient() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = Number(params?.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [patching, setPatching] = useState(false);
  const [dupId, setDupId] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [lRes, dRes] = await Promise.all([
        fetch(`/api/admin/leads/${id}/get`, { cache: "no-store" }),
        fetch(`/api/admin/dispatchers`, { cache: "no-store" }),
      ]);
      const lData = await lRes.json().catch(() => ({}));
      const dData = await dRes.json().catch(() => ({}));
      if (lData?.ok) { setLead(lData.lead); setDupId(lData.lead.duplicateOfId?.toString() ?? ""); }
      if (dData?.ok) setDispatchers(dData.users || []);
    } finally {
      setLoading(false);
    }
  }

  async function patch(body: Partial<Lead>) {
    if (!lead) return;
    setPatching(true);
    setLead((p) => p ? { ...p, ...body } : p);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data?.error || "Ошибка обновления");
      setLead((p) => p ? { ...p, ...data.lead } : p);
      toast.success("Сохранено");
    } catch (e: any) {
      toast.error("Не удалось сохранить", e?.message);
      load();
    } finally {
      setPatching(false);
    }
  }

  useEffect(() => {
    if (Number.isFinite(id)) load();
  }, [id]);

  if (!Number.isFinite(id)) return <div className="p-6 text-sm text-rose-600">Некорректный ID</div>;

  if (loading) return (
    <div className="flex items-center justify-center gap-2 py-24 text-sm text-zinc-500">
      <Spinner className="h-5 w-5" /> Загружаем лид…
    </div>
  );

  if (!lead) return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
      Лид не найден
    </div>
  );

  const phone = lead.phone;
  const digits = digitsOnly(phone);

  return (
    <div className="max-w-4xl">
      {/* ── Заголовок ──────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold text-zinc-400">#{lead.id}</span>
            <Badge color={STATUS_COLOR[lead.status]}>
              {STATUS_LABEL[lead.status]}
            </Badge>
            {lead.isDuplicate && (
              <Badge color="rose">Дубликат #{lead.duplicateOfId ?? "—"}</Badge>
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {lead.name}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-400">
            Создан: {dt(lead.createdAt)} · Обновлён: {dt(lead.updatedAt)}
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={() => router.push("/admin/leads")}>
          ← К списку
        </Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* ── Левый блок: информация ─────────────────────── */}
        <div className="grid gap-4">
          {/* Клиент */}
          <Card>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Клиент
            </h2>
            <dl>
              <InfoRow label="Имя">{lead.name}</InfoRow>
              <InfoRow label="Телефон">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono">{phone}</span>
                  <button
                    onClick={() => navigator.clipboard?.writeText(phone).then(() => toast.success("Скопировано"))}
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    Копировать
                  </button>
                  {digits && <>
                    <a href={`tel:${phone}`} className="rounded-lg border border-zinc-200 bg-white px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                      Позвонить
                    </a>
                    <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer"
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                      WhatsApp
                    </a>
                    <a href={`tg://resolve?phone=${digits}`} target="_blank" rel="noreferrer"
                      className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-800 hover:bg-sky-100 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
                      Telegram
                    </a>
                  </>}
                </div>
              </InfoRow>
            </dl>
          </Card>

          {/* Маршрут */}
          <Card>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Маршрут
            </h2>
            <dl>
              <InfoRow label="Откуда → Куда">
                <span className="font-semibold">{lead.fromText}</span>
                <span className="mx-2 text-zinc-400">→</span>
                <span className="font-semibold">{lead.toText}</span>
              </InfoRow>
              {lead.pickupAddress && <InfoRow label="Адрес подачи">{lead.pickupAddress}</InfoRow>}
              {lead.dropoffAddress && <InfoRow label="Адрес прибытия">{lead.dropoffAddress}</InfoRow>}
              <InfoRow label="Дата / время">{lead.datetime || "—"}</InfoRow>
            </dl>
          </Card>

          {/* Заказ */}
          <Card>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Заказ
            </h2>
            <dl>
              <InfoRow label="Класс авто">{lead.carClass}</InfoRow>
              <InfoRow label="Туда-обратно">{lead.roundTrip ? "Да" : "Нет"}</InfoRow>
              <InfoRow label="Цена">{lead.price != null ? `${lead.price} ₽` : "—"}</InfoRow>
              <InfoRow label="Комментарий">{lead.comment || "—"}</InfoRow>
            </dl>
          </Card>

          {/* UTM */}
          {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
            <Card>
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                UTM-метки
              </h2>
              <dl>
                <InfoRow label="utm_source">{lead.utmSource || "—"}</InfoRow>
                <InfoRow label="utm_medium">{lead.utmMedium || "—"}</InfoRow>
                <InfoRow label="utm_campaign">{lead.utmCampaign || "—"}</InfoRow>
              </dl>
            </Card>
          )}
        </div>

        {/* ── Правый блок: действия ──────────────────────── */}
        <div className="grid gap-4 lg:self-start lg:sticky lg:top-24">
          <Card>
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Действия
            </h2>

            {patching && (
              <div className="mb-3 flex items-center gap-2 text-xs text-zinc-400">
                <Spinner className="h-3.5 w-3.5" /> Сохраняем…
              </div>
            )}

            <div className="grid gap-3">
              <Field label="Статус">
                <Select
                  value={lead.status}
                  onChange={(e) => patch({ status: e.target.value as LeadStatus })}
                  disabled={patching}
                >
                  <option value="new">Новый</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Завершён</option>
                  <option value="canceled">Отменён</option>
                </Select>
              </Field>

              <Field label="Диспетчер">
                <Select
                  value={lead.assignedToId ?? ""}
                  onChange={(e) => patch({ assignedToId: e.target.value ? Number(e.target.value) : null })}
                  disabled={patching}
                >
                  <option value="">— не назначен —</option>
                  {dispatchers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Цена">
                <Input
                  type="number"
                  placeholder="₽"
                  defaultValue={lead.price ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    patch({ price: v ? Number(v) : null });
                  }}
                />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Btn variant="warning" size="sm" disabled={patching} onClick={() => patch({ status: "in_progress" })}>
                В работу
              </Btn>
              <Btn variant="success" size="sm" disabled={patching} onClick={() => patch({ status: "done" })}>
                Завершить
              </Btn>
              <Btn variant="danger" size="sm" disabled={patching} onClick={() => patch({ status: "canceled" })}>
                Отменить
              </Btn>
            </div>
          </Card>

          {/* Дубликат */}
          <Card>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Дубликат
            </h2>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={lead.isDuplicate}
                onChange={(e) => patch({ isDuplicate: e.target.checked, duplicateOfId: e.target.checked ? lead.duplicateOfId : null })}
              />
              Это дубликат
            </label>

            {lead.isDuplicate && (
              <div className="mt-3">
                <Field label="ID оригинала" hint="Введите ID и нажмите Enter или уберите фокус">
                  <Input
                    placeholder="например, 42"
                    value={dupId}
                    onChange={(e) => setDupId(e.target.value)}
                    onBlur={() => patch({ duplicateOfId: dupId.trim() ? Number(dupId.trim()) : null })}
                    onKeyDown={(e) => e.key === "Enter" && patch({ duplicateOfId: dupId.trim() ? Number(dupId.trim()) : null })}
                  />
                </Field>
              </div>
            )}
          </Card>

          {/* Ссылка на сайт */}
          <Card>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Навигация
            </h2>
            <div className="grid gap-2">
              <Btn variant="ghost" size="sm" onClick={() => router.push("/admin/leads")}>
                ← К списку лидов
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
                Дашборд
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
