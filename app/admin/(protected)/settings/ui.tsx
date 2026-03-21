"use client";

import { useEffect, useState } from "react";
import { useToast } from "../toast";
import { Btn, Card, Field, Input, Select, Textarea, SectionHeading, Badge, cn } from "../ui-kit";

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

type WebhookInfo = {
  url?: string;
  pending_update_count?: number;
  last_error_message?: string;
  last_error_date?: number;
  allowed_updates?: string[];
};

const EMPTY: Settings = {
  brandName: "Вектор РФ",
  brandTagline: "трансферы и поездки по России",
  phone: null, whatsapp: null, telegram: null, email: null,
  workHours: null, regionNote: null, companyName: null,
  inn: null, ogrn: null, address: null, notes: null,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {title}
      </h2>
      <div className="grid gap-4">{children}</div>
    </Card>
  );
}

export default function SettingsClient() {
  const toast = useToast();
  const [s, setS] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [tgLoading, setTgLoading] = useState(false);
  const [tg, setTg] = useState<{
    webhookUrlExpected?: string;
    secretExpected?: boolean;
    webhookInfo?: WebhookInfo;
  } | null>(null);

  function set(key: keyof Settings) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setS((p) => ({ ...p, [key]: e.target.value || null }));
  }

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data = await res.json().catch(() => ({}));
    setS(data.settings || EMPTY);
    setLoading(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(s),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok || !data.ok) {
      toast.error("Не удалось сохранить", data?.error);
      return;
    }
    toast.success("Настройки сохранены");
    load();
  }

  async function loadTg() {
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/webhook");
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (!res.ok || !data.ok) { toast.error("Ошибка Telegram", data?.error); return; }
    setTg({ webhookUrlExpected: data.webhookUrlExpected, secretExpected: data.secretExpected, webhookInfo: data.webhookInfo });
  }

  async function setTgWebhook() {
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/webhook", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (!res.ok || !data.ok) { toast.error("Не удалось установить webhook", data?.error); return; }
    toast.success("Webhook установлен ✅");
    loadTg();
  }

  async function testButtons() {
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/buttons-test", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (!res.ok || !data.ok) {
      toast.error("Ошибка", data?.error || "Не удалось отправить тест кнопок");
      return;
    }
    toast.success("Тест кнопок отправлен", "Нажми кнопку в Telegram — если ответит, кнопки работают");
  }

  async function sendTestMessage() {
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/test", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (!res.ok || !data.ok) { toast.error("Ошибка отправки теста", JSON.stringify(data?.result || data?.error)); return; }
    toast.success("Тестовое сообщение отправлено", "Проверьте Telegram-чат");
  }

  async function runDiagnostics() {
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/test");
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (data?.diag) {
      setTg((prev) => ({
        ...prev,
        webhookInfo: data.diag.webhook ? {
          url: data.diag.webhook.current_url === "(не установлен)" ? "" : data.diag.webhook.current_url,
          pending_update_count: data.diag.webhook.pending_updates,
          last_error_message: data.diag.webhook.last_error,
          last_error_date: undefined,
          allowed_updates: data.diag.webhook.allowed_updates,
        } : undefined,
        webhookUrlExpected: data.diag.webhook?.expected_url,
        secretExpected: !!data.diag.env?.TELEGRAM_WEBHOOK_SECRET?.startsWith("✓"),
      }));
      // Показываем итог диагностики
      const summary = data.diag.summary || "Диагностика завершена";
      if (summary.includes("✅")) toast.success("Диагностика", summary);
      else toast.error("Проблемы найдены", data.diag.webhook?.url_match_status || summary);
    }
  }

  async function deleteTgWebhook() {
    if (!window.confirm("Удалить webhook? Кнопки в Telegram перестанут работать.")) return;
    setTgLoading(true);
    const res = await fetch("/api/admin/telegram/webhook", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setTgLoading(false);
    if (!res.ok || !data.ok) { toast.error("Не удалось удалить webhook", data?.error); return; }
    toast.success("Webhook удалён");
    loadTg();
  }

  useEffect(() => { load(); loadTg(); }, []);

  const webhookOk = !!tg?.webhookInfo?.url;
  const lastErr = tg?.webhookInfo?.last_error_message
    ? `${tg.webhookInfo.last_error_message}${tg.webhookInfo.last_error_date ? ` (${new Date(tg.webhookInfo.last_error_date * 1000).toLocaleString("ru-RU")})` : ""}`
    : null;

  return (
    <div className="max-w-3xl">
      <SectionHeading
        title="Настройки"
        subtitle="Контакты, бренд, реквизиты и интеграции"
        action={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={load} loading={loading}>Обновить</Btn>
            <Btn variant="primary" onClick={save} loading={saving}>Сохранить</Btn>
          </div>
        }
      />

      <div className="grid gap-4">
        {/* Бренд */}
        <Section title="Бренд">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название">
              <Input value={s.brandName} onChange={set("brandName")} />
            </Field>
            <Field label="Слоган">
              <Input value={s.brandTagline ?? ""} onChange={set("brandTagline")} />
            </Field>
          </div>
        </Section>

        {/* Контакты */}
        <Section title="Контакты">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Телефон">
              <Input value={s.phone ?? ""} onChange={set("phone")} placeholder="+7 800 222-56-50" />
            </Field>
            <Field label="Email">
              <Input value={s.email ?? ""} onChange={set("email")} placeholder="info@vector-rf.ru" type="email" />
            </Field>
            <Field label="WhatsApp">
              <Input value={s.whatsapp ?? ""} onChange={set("whatsapp")} placeholder="+79001234567" />
            </Field>
            <Field label="Telegram">
              <Input value={s.telegram ?? ""} onChange={set("telegram")} placeholder="@vector_rf52" />
            </Field>
          </div>
          <Field label="Часы работы">
            <Input value={s.workHours ?? ""} onChange={set("workHours")} placeholder="Круглосуточно, 24/7" />
          </Field>
          <Field label="Примечание по регионам">
            <Input value={s.regionNote ?? ""} onChange={set("regionNote")} />
          </Field>
        </Section>

        {/* Реквизиты */}
        <Section title="Реквизиты">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Компания">
              <Input value={s.companyName ?? ""} onChange={set("companyName")} />
            </Field>
            <Field label="ИНН">
              <Input value={s.inn ?? ""} onChange={set("inn")} />
            </Field>
            <Field label="ОГРН">
              <Input value={s.ogrn ?? ""} onChange={set("ogrn")} />
            </Field>
            <Field label="Адрес">
              <Input value={s.address ?? ""} onChange={set("address")} />
            </Field>
          </div>
          <Field label="Заметки">
            <Textarea value={s.notes ?? ""} onChange={set("notes")} />
          </Field>
        </Section>

        {/* Telegram webhook */}
        <Section title="Telegram webhook">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Webhook:</span>
              <Badge color={webhookOk ? "emerald" : "rose"}>
                {webhookOk ? "✓ установлен" : "✗ не установлен"}
              </Badge>
              {/* Проверяем что текущий webhook URL совпадает с ожидаемым */}
              {webhookOk && tg?.webhookUrlExpected && tg?.webhookInfo?.url &&
                tg.webhookInfo.url !== tg.webhookUrlExpected && (
                <Badge color="amber">⚠ URL не совпадает</Badge>
              )}
            </div>

            <div className="grid gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {tg?.webhookInfo?.url ? (
                <div>
                  <span className="font-medium">Текущий: </span>
                  <span className="font-mono break-all">{tg.webhookInfo.url}</span>
                </div>
              ) : (
                <div className="text-rose-500">Webhook не установлен — кнопки в боте не работают</div>
              )}
              {tg?.webhookUrlExpected && (
                <div>
                  <span className="font-medium">Должен быть: </span>
                  <span className="font-mono break-all">{tg.webhookUrlExpected}</span>
                </div>
              )}
              {typeof tg?.webhookInfo?.pending_update_count === "number" && (
                <div>Очередь: {tg.webhookInfo.pending_update_count} событий</div>
              )}
              {typeof tg?.secretExpected === "boolean" && (
                <div>Secret-token: {tg.secretExpected ? "✓ включён" : "✗ не задан (TELEGRAM_WEBHOOK_SECRET)"}</div>
              )}
              {lastErr && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
                  ⚠ Ошибка: {lastErr}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn variant="ghost" onClick={loadTg} loading={tgLoading} size="sm">
              Проверить
            </Btn>
            <Btn variant="ghost" onClick={runDiagnostics} loading={tgLoading} size="sm">
              Диагностика
            </Btn>
            <Btn variant="primary" onClick={setTgWebhook} loading={tgLoading} size="sm">
              Установить webhook
            </Btn>
            <Btn variant="success" onClick={sendTestMessage} loading={tgLoading} size="sm">
              Тест сообщения
            </Btn>
            <Btn variant="ghost" onClick={testButtons} loading={tgLoading} size="sm">
              Тест кнопок
            </Btn>
            <Btn variant="danger" onClick={deleteTgWebhook} loading={tgLoading} size="sm">
              Удалить webhook
            </Btn>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Если кнопки в Telegram нажимаются, но статус не меняется — webhook не установлен или указывает на другой URL.
          </p>
        </Section>

        <div className="flex gap-2">
          <Btn variant="primary" onClick={save} loading={saving}>Сохранить настройки</Btn>
          <Btn variant="ghost" onClick={load} loading={loading}>Отменить изменения</Btn>
        </div>
      </div>
    </div>
  );
}
