import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../../../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

function prettifyCity(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Маппинг чтобы города нормально назывались (можешь дополнять)
const CITY_MAP: Record<string, string> = {
  "nizhniy-novgorod": "Нижний Новгород",
  moskva: "Москва",
  "sankt-peterburg": "Санкт-Петербург",
  kazan: "Казань",
  samara: "Самара",
  sochi: "Сочи",
  "rostov-na-donu": "Ростов-на-Дону",
  krasnodar: "Краснодар",
  volgograd: "Волгоград",
  voronezh: "Воронеж",
  belgorod: "Белгород",
  kursk: "Курск",

  // Новые территории
  donetsk: "Донецк",
  makeyevka: "Макеевка",
  mariupol: "Мариуполь",
  gorlovka: "Горловка",
  enakiyevo: "Енакиево",
  khartsyzk: "Харцызск",

  lugansk: "Луганск",
  alchevsk: "Алчевск",
  krasnodon: "Краснодон",
  severodonetsk: "Северодонецк",

  melitopol: "Мелитополь",
  berdyansk: "Бердянск",
  tokmak: "Токмак",

  kherson: "Херсон",
  genichesk: "Геническ",
  skadovsk: "Скадовск",
};

function cityName(slug: string) {
  return CITY_MAP[slug] ?? prettifyCity(slug);
}

type Props = {
  params: {
    from: string;
    to: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const from = cityName(params.from);
  const to = cityName(params.to);

  const url = `${SITE_URL}/route/${params.from}/${params.to}`;

  return {
    title: `Такси ${from} — ${to} | Межгород | Вектор РФ`,
    description: `Междугороднее такси ${from} — ${to}. Комфорт, бизнес, минивэн. Фиксируем заявку и согласуем стоимость заранее. Онлайн-заявка 24/7.`,
    alternates: { canonical: url },

    openGraph: {
      type: "website",
      url,
      title: `Такси ${from} — ${to} | Вектор РФ`,
      description: `Поездка ${from} — ${to}: комфортные автомобили, согласуем стоимость заранее. Онлайн-заявка 24/7.`,
      siteName: SITE_NAME,
      locale: "ru_RU",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Вектор РФ — трансферы" }],
    },

    twitter: {
      card: "summary_large_image",
      title: `Такси ${from} — ${to} | Вектор РФ`,
      description: `Междугородний трансфер ${from} — ${to}. Онлайн-заявка 24/7.`,
      images: ["/og.jpg"],
    },
  };
}

export default function Page({ params }: Props) {
  const from = cityName(params.from);
  const to = cityName(params.to);

  const canonical = `${SITE_URL}/route/${params.from}/${params.to}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Такси ${from} — ${to}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: ["Междугороднее такси", "Трансфер между городами"],
    url: canonical,
  };

  return (
    <>
      <Script
        id={`ld-${params.from}-${params.to}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServicePage
        breadcrumbs={[
          { name: "Главная", href: "/" },
          { name: `${from} — ${to}`, href: `/route/${params.from}/${params.to}` },
        ]}
        title={`Такси ${from} — ${to}`}
        subtitle={`Междугородняя поездка ${from} — ${to}. Подбор класса авто, согласование маршрута и стоимости заранее. Работаем 24/7.`}
        bullets={[
          `Поездка ${from} — ${to} на комфортном автомобиле`,
          "Комфорт / Бизнес / Минивэн",
          "Стоимость согласуем до подачи автомобиля",
          "Можно указать остановки и пожелания",
          "Работаем 24/7, заявка онлайн за 1 минуту",
        ]}
        faq={[
          {
            q: "Можно ли заказать поездку заранее?",
            a: "Да. Укажите дату и время — мы зафиксируем заявку и подтвердим подачу автомобиля.",
          },
          {
            q: "Можно ли добавить остановки по пути?",
            a: "Да. Просто напишите остановки в комментарии — мы учтём это при согласовании стоимости.",
          },
          {
            q: "Какие классы доступны?",
            a: "Стандарт, Комфорт, Бизнес и Минивэн. Выберите класс в форме — мы подтвердим доступность.",
          },
        ]}
      />
    </>
  );
}