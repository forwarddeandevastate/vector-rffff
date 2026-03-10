"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { CORE_SERVICE_LINKS, POPULAR_ROUTE_LINKS } from "@/lib/internal-links";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const LeadForm = dynamic(() => import("@/app/lead-form"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[28px] border border-zinc-200 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-extrabold text-zinc-900">Загружаем форму</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">
        Если форма не загрузится, вернитесь на главную и оставьте заявку там.
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/#order"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
        >
          Оставить заявку
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
        >
          На главную
        </Link>
      </div>
    </div>
  ),
});

type CarClass = "standard" | "comfort" | "business" | "minivan";
type RouteType = "city" | "airport" | "intercity";

type Breadcrumb = { name: string; href: string };
type FAQItem = { q: string; a: string };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
      {children}
    </span>
  );
}

export default function ServicePage({
  breadcrumbs,
  title,
  subtitle,
  bullets,
  faq,
}: {
  breadcrumbs: Breadcrumb[];
  title: string;
  subtitle: string;
  bullets: string[];
  faq: FAQItem[];
}) {
  const PHONE_DISPLAY = "8 (800) 222-56-50";
  const PHONE_TEL = "+78002225650";
  const TELEGRAM = "https://t.me/vector_rf52";

  const routeType: RouteType = useMemo(() => {
    const last = breadcrumbs?.[breadcrumbs.length - 1]?.href ?? "";
    if (last.includes("airport")) return "airport";
    if (last.includes("intercity")) return "intercity";
    return "city";
  }, [breadcrumbs]);

  const defaultClass: CarClass = "standard";

  return (
    <main className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="pt-2">
            <nav className="text-sm text-zinc-500">
              <ol className="flex flex-wrap gap-2">
                {breadcrumbs.map((b, idx) => (
                  <li key={b.href} className="flex items-center gap-2">
                    <Link href={b.href} className="hover:text-zinc-900">
                      {b.name}
                    </Link>
                    {idx !== breadcrumbs.length - 1 ? <span>/</span> : null}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>Проверенные водители</Badge>
              <Badge>Фиксация заявки</Badge>
              <Badge>Стоимость заранее</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-zinc-900 md:text-6xl">
              {title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-700">
              {subtitle}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {bullets.slice(0, 3).map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur"
                >
                  <div className="text-sm font-extrabold text-zinc-900">{item}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-sky-100 bg-white/85 p-5 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Преимущества</div>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-700">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span className="leading-6">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#order"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                Оставить заявку
              </a>

              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                {PHONE_DISPLAY}
              </a>

              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Telegram
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/#order"
                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                Оставить заявку
              </Link>
              <Link
                href="/prices"
                className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Выбрать класс авто
              </Link>
              <Link
                href="/reviews"
                className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Отзывы
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Вопросы и ответы
              </Link>
              <Link
                href="/contacts"
                className="inline-flex items-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Контакты
              </Link>
            </div>
          </section>

          <aside id="order" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white/88 shadow-xl backdrop-blur">
              <div className="grid grid-cols-2 gap-3 border-b border-zinc-200 p-4">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  Позвонить
                </a>
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 shadow-sm hover:bg-zinc-50"
                >
                  Telegram
                </a>
              </div>

              <div className="border-b border-zinc-200 px-5 py-4">
                <div className="text-sm font-extrabold text-zinc-900">
                  Заполнить заявку
                </div>
              </div>

              <div className="p-4 md:p-5">
                <LeadForm
                  carClass={defaultClass}
                  routeType={routeType}
                  onCarClassChange={() => {}}
                  onRouteTypeChange={() => {}}
                />
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="text-xl font-extrabold text-zinc-900">Вопросы</div>
          <div className="mt-5 grid gap-4">
            {faq.map((x) => (
              <div
                key={x.q}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="text-sm font-extrabold text-zinc-900">{x.q}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-700">{x.a}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-extrabold text-zinc-900">Полезные разделы</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {CORE_SERVICE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="text-sm font-extrabold text-zinc-900">Популярные маршруты</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_ROUTE_LINKS.slice(0, 8).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}