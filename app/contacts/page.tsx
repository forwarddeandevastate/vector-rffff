import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PageShell, Breadcrumb, GlassPanel, Tag, IconPhone, IconTelegram, PHONE_DISPLAY, PHONE_TEL, TELEGRAM } from "@/app/ui/shared";
import { BLOG_COMMERCIAL_LINKS, CORE_SERVICE_LINKS } from "@/lib/internal-links";

function IconEmail({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconForm({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
    </svg>
  );
}

const SITE_URL = "https://vector-rf.ru";
const PAGE_URL = `${SITE_URL}/contacts`;
const PHONE_E164 = "+78002225650";

export const metadata: Metadata = {
  title: "Контакты — заказать трансфер, такси межгород 24/7",
  description: "Контакты сервиса Вектор РФ: телефон, Telegram для заказа такси и трансферов по России. Принимаем заявки 24/7, отвечаем быстро.",
  alternates: { canonical: "/contacts" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", url: PAGE_URL, title: "Контакты Вектор РФ", description: "Телефон, Telegram для заявок.", siteName: "Вектор РФ", locale: "ru_RU", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Контакты Вектор РФ" }] },
  twitter: { card: "summary_large_image", title: "Контакты Вектор РФ", description: "Телефон, Telegram.", images: ["/og.jpg"] },
};

export default function ContactsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Контакты", item: PAGE_URL },
    ],
  };
  const contactJsonLd = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "Вектор РФ", url: SITE_URL,
    contactPoint: [{ "@type": "ContactPoint", telephone: PHONE_E164, contactType: "customer service", availableLanguage: ["Russian"] }],
    sameAs: [TELEGRAM],
  };

  const contacts = [
    { type: "Телефон", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, icon: <IconPhone className="h-5 w-5 text-blue-500" />, desc: "Звоните 24/7" },
    { type: "Telegram", value: "@vector_rf52", href: TELEGRAM, ext: true, icon: <IconTelegram className="h-5 w-5 text-blue-500" />, desc: "Напишите в мессенджер" },
    { type: "Email", value: "info@vector-rf.ru", href: "mailto:info@vector-rf.ru", icon: <IconEmail className="h-5 w-5 text-blue-500" />, desc: "Для деловых вопросов" },
    { type: "Заявка на сайте", value: "Перейти к форме", href: "/", desc: "Форма на главной", icon: <IconForm className="h-5 w-5 text-blue-500" /> },
  ];

  return (
    <>
      <Script id="ld-contacts-breadcrumbs" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="ld-contacts-org" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <PageShell>
        <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <Breadcrumb items={[{ name: "Главная", href: "/" }, { name: "Контакты", href: "/contacts" }]} />

          <div className="mt-6">
            <Tag>Работаем 24/7</Tag>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Контакты</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Для заявок на поездки, трансферы в аэропорт и корпоративные маршруты — используйте телефон, Telegram или форму на сайте.
            </p>
          </div>

          <h2 className="mt-8 text-xl font-extrabold text-slate-900">Как с нами связаться</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {contacts.map((c) => (
              <a
                key={c.type}
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group rounded-3xl border border-blue-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {c.icon && <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 border border-blue-100">{c.icon}</div>}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-400">{c.type}</div>
                    <div className="text-sm font-bold text-slate-800">{c.value}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">{c.desc}</div>
              </a>
            ))}
          </div>

          <GlassPanel className="mt-8 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Быстрые ссылки</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/services" className="btn-primary inline-flex items-center rounded-xl px-4 py-2.5 text-sm">Все услуги</Link>
              <Link href="/" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">Оставить заявку</Link>
              <Link href="/requisites" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">Реквизиты</Link>
              <Link href="/faq" className="btn-ghost inline-flex items-center rounded-xl px-4 py-2.5 text-sm">FAQ</Link>
            </div>
          </GlassPanel>

          <GlassPanel className="mt-6 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Как быстро оформить заявку</h2>
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p>
                Позвоните по номеру 8 800 222-56-50 (звонок бесплатный) или напишите в Telegram — оператор уточнит маршрут, время подачи и класс автомобиля, после чего подтвердит стоимость.
              </p>
              <p>
                Также можно оставить заявку через форму на главной странице: укажите откуда и куда, дату и количество пассажиров. Перезвоним в течение нескольких минут.
              </p>
              <p>
                Для корпоративных клиентов — выставляем счёт, заключаем договор и предоставляем закрывающие документы. Свяжитесь с нами по телефону или email для обсуждения условий сотрудничества.
              </p>
              <p>
                Головной офис: Нижний Новгород, ул. Большая Покровская, 60. Работаем круглосуточно, без выходных.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel className="mt-6 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Часто задаваемые вопросы</h2>
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p><strong>Как быстро перезванивают?</strong> Обычно в течение нескольких минут. В ночное время — в зависимости от загрузки, но заявки принимаем круглосуточно.</p>
              <p><strong>Можно ли написать, а не звонить?</strong> Да, пишите в Telegram — отвечаем в мессенджерах так же оперативно.</p>
              <p><strong>Как оставить заявку для юрлица?</strong> Напишите на email или позвоните — обсудим условия договора, схему оплаты и документооборот. Выставляем счёт и предоставляем закрывающие документы.</p>
              <p><strong>Работаете ли в праздники?</strong> Да, принимаем заявки и выполняем поездки круглосуточно, без выходных и праздников.</p>
            </div>
          </GlassPanel>
        
          <div className="mt-8 rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h2 className="text-xl font-extrabold text-slate-900 mb-3">Как мы принимаем заявки</h2>
            <div className="space-y-3 text-sm leading-6 text-slate-600">
              <p>Заявку можно оставить удобным способом: через форму на сайте, по телефону или в Telegram. Оператор перезванивает в течение 15–30 минут, уточняет маршрут, время и класс автомобиля, затем подтверждает стоимость до выезда.</p>
              <p>Для корпоративных клиентов работаем по договору — выставляем счёт, предоставляем акт выполненных работ и счёт-фактуру. Для заключения договора обращайтесь по телефону или Telegram.</p>
              <p>Срочные заявки рассматриваем в режиме реального времени. Для поездок в аэропорт рекомендуем бронировать за 3–6 часов, для межгорода — за 1–2 дня.</p>
            </div>
          </div>
        
          <div className="mt-6 rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Режим работы</h2>
            <p className="text-sm leading-6 text-slate-600">
              Принимаем заявки круглосуточно, 7 дней в неделю, включая праздники.
              Для поездок в аэропорт — рекомендуем бронировать за 3–6 часов.
              Межгородские маршруты — за 1–2 дня для гарантированной подачи.
              Срочные заявки рассматриваем в режиме реального времени.
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div className="mt-6 rounded-3xl border border-blue-100/60 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">Заказать поездку</div>
            <div className="flex flex-wrap gap-2">
              <Link href="/taxi-mezhgorod"
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">
                Такси межгород
              </Link>
              <Link href="/transfer-v-aeroport"
                className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                Трансфер в аэропорт
              </Link>
              <Link href="/prices"
                className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                Цены на поездки
              </Link>
              <Link href="/blog"
                className="inline-flex items-center rounded-full border border-blue-100/60 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                Блог
              </Link>
            </div>
          </div>

          {/* Полезные статьи — привязка к коммерческим страницам */}
          <div className="mt-6 rounded-3xl border border-blue-100/60 bg-white/70 p-6 shadow-sm backdrop-blur">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">Полезно перед заказом</h2>
            <p className="text-xs text-slate-400 mb-4">Статьи блога, которые помогут спланировать поездку</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BLOG_COMMERCIAL_LINKS.map((b) => (
                <Link key={b.href} href={b.href}
                  className="group rounded-2xl border border-blue-100/60 bg-white p-4 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">Блог</span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                    {b.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </PageShell>
    </>
  );
}
