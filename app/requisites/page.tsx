import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RequisitesClient from "./requisites-client";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

const PHONE_DISPLAY = "+7 (831) 423-39-29";
const PHONE_TEL = "+78314233929";
const TELEGRAM = "https://t.me/vector_rf52";

export const metadata: Metadata = {
  title: "Реквизиты — Вектор РФ",
  description: "Реквизиты для оплаты услуг «Вектор РФ».",
  alternates: { canonical: `${SITE_URL}/requisites` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/requisites`,
    title: "Реквизиты — Вектор РФ",
    description: "Реквизиты для оплаты услуг «Вектор РФ».",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — реквизиты" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Реквизиты — Вектор РФ",
    description: "Реквизиты для оплаты услуг «Вектор РФ».",
    images: ["/og.jpg"],
  },
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function RequisitesPage() {
  const requisites = [
    { label: "Получатель", value: "ИП НАРТОВ АЛЕКСЕЙ АЛЕКСЕЕВИЧ" },
    { label: "ИНН", value: "526320552640" },
    { label: "ОГРНИП", value: "326237500025657" },
  ];

  const plainText = `ИП НАРТОВ АЛЕКСЕЙ АЛЕКСЕЕВИЧ
ИНН 526320552640
ОГРНИП 326237500025657`;

  return (
    <main className="min-h-screen text-zinc-900">
      {/* фон как на главной */}
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.28),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <header className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Документы</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Реквизиты</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Реквизиты для оплаты услуг. Если нужно выставить счёт или уточнить детали — напишите в Telegram или
                позвоните.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                На главную
              </Link>
              <Link
                href="/contacts"
                className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                Контакты
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-12">
          {/* QR */}
          <div className="md:col-span-5 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
            <div className="text-sm font-extrabold text-zinc-900">QR для оплаты</div>
            <p className="mt-2 text-sm text-zinc-600">Отсканируйте QR-код в приложении банка.</p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="relative mx-auto aspect-square w-full max-w-[360px]">
                <Image
                  src="/requisites-qr.png"
                  alt="QR-код для оплаты"
                  fill
                  sizes="(max-width: 768px) 92vw, 360px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="mt-4 text-xs text-zinc-500">
              Если QR не сканируется — используйте реквизиты вручную справа.
            </div>
          </div>

          {/* Реквизиты */}
          <div className="md:col-span-7 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Реквизиты</div>
                <p className="mt-2 text-sm text-zinc-600">Скопируйте данные одним нажатием.</p>
              </div>

              <RequisitesClient plainText={plainText} />
            </div>

            <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white/70">
              {requisites.map((r) => (
                <div key={r.label} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs font-semibold text-zinc-600">{r.label}</div>
                  <div className="text-sm font-extrabold text-zinc-900">{r.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/70 p-4">
              <div className="text-xs font-semibold text-zinc-600">Связь</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                    "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                  )}
                >
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold",
                    "border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
                  )}
                >
                  Telegram
                </a>
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                Напишите, что вам нужны реквизиты/счёт — ответим быстрее.
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 border-t border-zinc-200/70 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} Вектор РФ. Все права защищены.
        </footer>
      </div>
    </main>
  );
}