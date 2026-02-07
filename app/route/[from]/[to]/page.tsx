import type { Metadata } from "next";
import Script from "next/script";
import ServicePage from "../../../ui/service-page";

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";

// Аккуратный fallback: если города нет в маппинге — показываем как есть, но безопасно
function safePretty(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";

  // если вдруг прилетит %D0... — декодируем
  const decoded = (() => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();

  // "rostov-na-donu" -> "rostov na donu"
  return decoded
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Маппинг slug -> нормальное русское название
const CITY_MAP: Record<string, string> = {
  // хабы
  moskva: "Москва",
  "sankt-peterburg": "Санкт-Петербург",
  "nizhniy-novgorod": "Нижний Новгород",
  kazan: "Казань",
  samara: "Самара",
  saratov: "Саратов",
  volgograd: "Волгоград",
  krasnodar: "Краснодар",
  "rostov-na-donu": "Ростов-на-Дону",
  voronezh: "Воронеж",
  tula: "Тула",
  ryazan: "Рязань",
  yaroslavl: "Ярославль",
  tver: "Тверь",
  smolensk: "Смоленск",
  kaliningrad: "Калининград",
  "velikiy-novgorod": "Великий Новгород",
  pskov: "Псков",
  astrakhan: "Астрахань",
  chelyabinsk: "Челябинск",
  novosibirsk: "Новосибирск",
  krasnoyarsk: "Красноярск",

  // Москва и МО
  balashikha: "Балашиха",
  khimki: "Химки",
  podolsk: "Подольск",
  mytishchi: "Мытищи",
  korolev: "Королёв",
  lyubertsy: "Люберцы",
  elektrostal: "Электросталь",
  kolomna: "Коломна",
  odintsovo: "Одинцово",
  krasnogorsk: "Красногорск",
  serpukhov: "Серпухов",
  "orekhovo-zuevo": "Орехово-Зуево",
  "shchyolkovo": "Щёлково",
  ramenskoye: "Раменское",
  domodedovo: "Домодедово",
  pushkino: "Пушкино",
  zhukovskiy: "Жуковский",
  reutov: "Реутов",
  noginsk: "Ногинск",

  // Белгородская
  belgorod: "Белгород",
  "staryy-oskol": "Старый Оскол",
  gubkin: "Губкин",

  // Брянская
  bryansk: "Брянск",
  klintsy: "Клинцы",

  // Владимирская
  vladimir: "Владимир",
  kovrov: "Ковров",
  murom: "Муром",

  // Ивановская
  ivanovo: "Иваново",

  // Калужская
  kaluga: "Калуга",
  obninsk: "Обнинск",

  // Костромская
  kostroma: "Кострома",

  // Курская
  kursk: "Курск",
  "zheleznogorsk-kursk": "Железногорск",

  // Липецкая
  lipetsk: "Липецк",
  yelets: "Елец",

  // Орловская
  orel: "Орёл",

  // Тамбовская
  tambov: "Тамбов",

  // Архангельская
  arkhangelsk: "Архангельск",
  severodvinsk: "Северодвинск",

  // Вологодская
  vologda: "Вологда",
  cherepovets: "Череповец",

  // Волгоградская (добавочно)
  volzhskiy: "Волжский",
  kamyshin: "Камышин",

  // Краснодарский край
  sochi: "Сочи",
  novorossiysk: "Новороссийск",
  armavir: "Армавир",
  anapa: "Анапа",

  // Адыгея
  maykop: "Майкоп",

  // Ростовская (добавочно)
  taganrog: "Таганрог",
  shakhty: "Шахты",
  novocherkassk: "Новочеркасск",
  volgodonsk: "Волгодонск",
  bataysk: "Батайск",
  "kamensk-shakhtinskiy": "Каменск-Шахтинский",

  // Крым / Севастополь
  simferopol: "Симферополь",
  sevastopol: "Севастополь",
  kerch: "Керчь",
  evpatoriya: "Евпатория",

  // Ставропольский край
  stavropol: "Ставрополь",
  pyatigorsk: "Пятигорск",
  kislovodsk: "Кисловодск",
  essentuki: "Ессентуки",
  nevinnomyssk: "Невинномысск",

  // Челябинская (добавочно)
  magnitogorsk: "Магнитогорск",
  zlatoust: "Златоуст",
  miass: "Миасс",
  kopeysk: "Копейск",

  // Новосибирская (добавочно)
  berdsk: "Бердск",

  // Красноярский край (добавочно)
  norilsk: "Норильск",
  achinsk: "Ачинск",
  kansk: "Канск",
  "zheleznogorsk-krasnoyarsk": "Железногорск",

  // Новые территории
  donetsk: "Донецк",
  makeyevka: "Макеевка",
  mariupol: "Мариуполь",
  gorlovka: "Горловка",
  lugansk: "Луганск",
  melitopol: "Мелитополь",
  berdyansk: "Бердянск",
  kherson: "Херсон",
};

function cityName(slug: string) {
  const s = (slug ?? "").trim();
  if (!s) return "Город";
  return CITY_MAP[s] ?? safePretty(s);
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