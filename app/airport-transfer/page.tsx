import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

export const metadata: Metadata = {
  title: "Трансфер в аэропорт и из аэропорта",
  description:
    "Трансфер в аэропорт и из аэропорта: встреча по времени прилёта, помощь с багажом, согласование стоимости заранее. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",
  alternates: { canonical: `${SITE_URL}/airport-transfer` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/airport-transfer`,
    title: "Трансфер в аэропорт — Вектор РФ",
    description:
      "Встреча по времени прилёта, подача авто, помощь с багажом. Стоимость согласуем заранее. 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Трансфер в аэропорт — Вектор РФ",
    description: "Трансфер в аэропорт и из аэропорта. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },
};

type LinkItem = { from: string; to: string; label: string };

const AIRPORT_ROUTES: LinkItem[] = [
  // Москва / МО
  { from: "moskva", to: "domodedovo", label: "Москва — Домодедово" },
  { from: "domodedovo", to: "moskva", label: "Домодедово — Москва" },
  { from: "moskva", to: "khimki", label: "Москва — Химки" },
  { from: "khimki", to: "moskva", label: "Химки — Москва" },
  { from: "moskva", to: "podolsk", label: "Москва — Подольск" },
  { from: "podolsk", to: "moskva", label: "Подольск — Москва" },

  // СПб / Ленобласть
  { from: "sankt-peterburg", to: "velikiy-novgorod", label: "Санкт-Петербург — Великий Новгород" },
  { from: "velikiy-novgorod", to: "sankt-peterburg", label: "Великий Новгород — Санкт-Петербург" },
  { from: "sankt-peterburg", to: "pskov", label: "Санкт-Петербург — Псков" },
  { from: "pskov", to: "sankt-peterburg", label: "Псков — Санкт-Петербург" },

  // Нижний / Поволжье
  { from: "nizhniy-novgorod", to: "moskva", label: "Нижний Новгород — Москва" },
  { from: "moskva", to: "nizhniy-novgorod", label: "Москва — Нижний Новгород" },
  { from: "kazan", to: "moskva", label: "Казань — Москва" },
  { from: "samara", to: "moskva", label: "Самара — Москва" },

  // Юг / курорты
  { from: "rostov-na-donu", to: "krasnodar", label: "Ростов-на-Дону — Краснодар" },
  { from: "krasnodar", to: "rostov-na-donu", label: "Краснодар — Ростов-на-Дону" },
  { from: "krasnodar", to: "sochi", label: "Краснодар — Сочи" },
  { from: "sochi", to: "krasnodar", label: "Сочи — Краснодар" },
  { from: "krasnodar", to: "anapa", label: "Краснодар — Анапа" },
  { from: "anapa", to: "krasnodar", label: "Анапа — Краснодар" },
  { from: "krasnodar", to: "novorossiysk", label: "Краснодар — Новороссийск" },
  { from: "novorossiysk", to: "krasnodar", label: "Новороссийск — Краснодар" },

  // Крым
  { from: "rostov-na-donu", to: "simferopol", label: "Ростов-на-Дону — Симферополь" },
  { from: "krasnodar", to: "simferopol", label: "Краснодар — Симферополь" },
  { from: "simferopol", to: "sevastopol", label: "Симферополь — Севастополь" },

  // Новые территории
  { from: "donetsk", to: "rostov-na-donu", label: "Донецк — Ростов-на-Дону" },
  { from: "lugansk", to: "rostov-na-donu", label: "Луганск — Ростов-на-Дону" },
  { from: "mariupol", to: "taganrog", label: "Мариуполь — Таганрог" },
  { from: "melitopol", to: "rostov-na-donu", label: "Мелитополь — Ростов-на-Дону" },
  { from: "kherson", to: "simferopol", label: "Херсон — Симферополь" },
];

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function PopularBlock() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
          Популярные направления (аэропорт)
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Быстрые ссылки на частые маршруты “в аэропорт / из аэропорта”. Открывайте страницу и оставляйте заявку.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AIRPORT_ROUTES.map((r) => (
            <a
              key={`${r.from}__${r.to}`}
              href={`/route/${r.from}/${r.to}`}
              className={cn(
                "rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-semibold",
                "text-zinc-800 shadow-sm backdrop-blur hover:bg-white hover:border-sky-200/80"
              )}
            >
              {r.label}
            </a>
          ))}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Не нашли направление? Оставьте заявку — мы уточним терминал/рейс и заранее согласуем стоимость.
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Трансфер в аэропорт и из аэропорта",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Трансфер в аэропорт", "Трансфер из аэропорта"],
    url: `${SITE_URL}/airport-transfer`,
  };

  return (
    <>
      <Script
        id="ld-airport"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: "Трансфер в аэропорт", href: "/airport-transfer" },
        ]}
        title="Трансфер в аэропорт и из аэропорта"
        subtitle="Встречаем по времени прилёта и подаём автомобиль к нужному месту. Помогаем с багажом, стоимость согласуем заранее. 24/7."
        bullets={[
          "Встреча по времени прилёта (или подача к вылету)",
          "Можно указать номер рейса и комментарии",
          "Комфорт / Бизнес / Минивэн",
          "Помощь с багажом по запросу",
          "Стоимость согласуем до подачи автомобиля",
        ]}
        faq={[
          { q: "Встречаете с табличкой?", a: "Да, по запросу. Укажите это в комментарии к заявке — подтвердим детали." },
          { q: "Если рейс задержали?", a: "Если вы указали рейс, ориентируемся по фактическому времени прилёта и согласуем ожидание." },
          { q: "Можно заказать детское кресло?", a: "Да, укажите возраст ребёнка — подберём подходящее кресло." },
        ]}
      />

      <PopularBlock />
    </>
  );
}