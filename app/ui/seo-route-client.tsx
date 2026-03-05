"use client";

import { useState } from "react";
import Link from "next/link";
import LeadForm, { type CarClass, type RouteType } from "../lead-form";
import type { FAQItem } from "@/lib/city-faq";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SmallBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5",
        "text-xs font-semibold text-zinc-800 shadow-sm"
      )}
    >
      {children}
    </span>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.8 3.9c.6-.5 1.5-.5 2.1 0l2.1 2.1c.6.6.6 1.5 0 2.1l-1 1a1 1 0 0 0-.2 1.1c.8 1.6 2.1 2.9 3.7 3.7a1 1 0 0 0 1.1-.2l1-1c.6-.6 1.5-.6 2.1 0l2.1 2.1c.5.6.5 1.5 0 2.1l-1.2 1.2c-.9.9-2.2 1.2-3.4.8-6.7-2.2-12.1-7.6-14.3-14.3-.4-1.2-.1-2.5.8-3.4L7.8 3.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.75 5.6 3.9 12.2c-.8.3-.79 1.44.02 1.72l4.2 1.45 1.6 4.93c.26.8 1.27.95 1.74.27l2.4-3.5 4.1 3.01c.63.46 1.51.12 1.7-.66l2.2-13.96c.13-.83-.7-1.46-1.41-1.18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.1 15.4 18.4 7.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function SeoRouteClient(props: {
  fromSlug: string;
  toSlug: string;
  fromName: string;
  toName: string;
  cityBackHref: string;
  cityBackLabel: string;
  content: string;
  faq: FAQItem[];
  moreFromCity: Array<{ toSlug: string; toName: string }>;
}) {
  const PHONE_TEL = "+78314233929";
  const TELEGRAM = "https://t.me/vector_rf52";

  const [carClass, setCarClass] = useState<CarClass>("standard");
  const [routeType, setRouteType] = useState<RouteType>("intercity");

  return (
    <div className="min-h-screen text-zinc-900">
      <div className="fixed inset-0 -z-20 bg-[#f3f7ff]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1100px_520px_at_50%_-10%,rgba(56,189,248,0.35),transparent_60%),radial-gradient(900px_520px_at_12%_18%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_520px_at_88%_20%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="fixed inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/70 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-sm font-extrabold text-zinc-900 hover:opacity-90">
            Вектор РФ
          </Link>
          <Link
            href={props.cityBackHref}
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            {props.cityBackLabel}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Такси {props.fromName} — {props.toName}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Прямая поездка без пересадок. Стоимость согласуем заранее. Работаем 24/7.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <SmallBadge>Подтверждение цены до поездки</SmallBadge>
              <SmallBadge>Комфорт / бизнес / минивэн</SmallBadge>
              <SmallBadge>Заявка онлайн</SmallBadge>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Описание маршрута</div>
              <p className="mt-3 text-sm leading-6 text-zinc-700">{props.content}</p>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">Ещё маршруты из {props.fromName}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {props.moreFromCity.map((p) => (
                  <Link
                    key={p.toSlug}
                    href={`/${props.fromSlug}/${p.toSlug}`}
                    className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50"
                  >
                    {props.fromName} — {p.toName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-sm font-extrabold text-zinc-900">FAQ</div>
              <div className="mt-4 space-y-4">
                {props.faq.map((f, idx) => (
                  <div key={idx} className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                    <div className="text-sm font-semibold text-zinc-900">{f.question}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">{f.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white/85 shadow-xl backdrop-blur">
              <div className="border-b border-zinc-200 p-5">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold",
                      "border border-zinc-200 bg-white/80 shadow-sm hover:bg-white"
                    )}
                    title="Позвонить"
                  >
                    <IconPhone className="h-4 w-4 text-sky-700" />
                    Позвонить
                  </a>
                  <a
                    href={TELEGRAM}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold",
                      "border border-zinc-200 bg-white/80 shadow-sm hover:bg-white"
                    )}
                    title="Написать в Telegram"
                  >
                    <IconTelegram className="h-4 w-4 text-sky-700" />
                    Telegram
                  </a>
                </div>

                <div className="mt-4">
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                    Трансфер, которому <span className="text-sky-700">доверяют</span>
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Оставьте заявку за 1 минуту. Мы уточним детали, подтвердим стоимость и организуем подачу автомобиля.
                  </p>
                </div>
              </div>

              <div className="p-5">
                <LeadForm
                  carClass={carClass}
                  onCarClassChange={setCarClass}
                  routeType={routeType}
                  onRouteTypeChange={setRouteType}
                  initialFrom={props.fromName}
                  initialTo={props.toName}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200/70 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-zinc-700">Услуги</div>
              <div className="mt-3 grid gap-2 text-xs text-zinc-600">
                <a href="/city-transfer" className="hover:text-zinc-900 hover:underline">
                  Поездки по городу
                </a>
                <a href="/airport-transfer" className="hover:text-zinc-900 hover:underline">
                  Трансфер в аэропорт
                </a>
                <a href="/intercity-taxi" className="hover:text-zinc-900 hover:underline">
                  Междугородние поездки
                </a>
                <a href="/minivan-transfer" className="hover:text-zinc-900 hover:underline">
                  Минивэн / групповые поездки
                </a>
                <a href="/corporate" className="hover:text-zinc-900 hover:underline">
                  Корпоративные перевозки
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-700">Навигация</div>
              <div className="mt-3 grid gap-2 text-xs text-zinc-600">
                <a href="/services" className="hover:text-zinc-900 hover:underline">
                  Наш сервис
                </a>
                <a href="/reviews" className="hover:text-zinc-900 hover:underline">
                  Отзывы
                </a>
                <a href="/faq" className="hover:text-zinc-900 hover:underline">
                  Вопросы и ответы
                </a>
                <a href="/contacts" className="hover:text-zinc-900 hover:underline">
                  Контакты
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-700">Информация</div>
              <div className="mt-3 grid gap-2 text-xs text-zinc-600">
                <a href="/prices" className="hover:text-zinc-900 hover:underline">
                  Цены
                </a>
                <a href="/requisites" className="hover:text-zinc-900 hover:underline">
                  Реквизиты компании
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-500">© {new Date().getFullYear()} Вектор РФ. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}
