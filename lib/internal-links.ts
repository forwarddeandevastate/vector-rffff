export const CORE_SERVICE_LINKS = [
  { href: "/taxi-mezhgorod", label: "Междугороднее такси" },
  { href: "/transfer-v-aeroport", label: "Трансфер в аэропорт" },
  { href: "/city-transfer", label: "Поездки по городу" },
  { href: "/minivan-transfer", label: "Минивэн / групповые поездки" },
  { href: "/corporate", label: "Корпоративные перевозки" },
  { href: "/prices", label: "Цены на поездки" },
  { href: "/reviews", label: "Отзывы клиентов" },
  { href: "/contacts", label: "Контакты" },
];

export const POPULAR_ROUTE_LINKS = [
  { href: "/moskva/nizhniy-novgorod", label: "Москва — Нижний Новгород" },
  { href: "/nizhniy-novgorod/moskva", label: "Нижний Новгород — Москва" },
  { href: "/moskva/kazan", label: "Москва — Казань" },
  { href: "/kazan/moskva", label: "Казань — Москва" },
  { href: "/moskva/sankt-peterburg", label: "Москва — Санкт-Петербург" },
  { href: "/moskva/tula", label: "Москва — Тула" },
  { href: "/moskva/yaroslavl", label: "Москва — Ярославль" },
  { href: "/moskva/ryazan", label: "Москва — Рязань" },
  { href: "/krasnodar/sochi", label: "Краснодар — Сочи" },
  { href: "/krasnodar/rostov-na-donu", label: "Краснодар — Ростов-на-Дону" },
  { href: "/yekaterinburg/tyumen", label: "Екатеринбург — Тюмень" },
  { href: "/nizhniy-novgorod/kazan", label: "Нижний Новгород — Казань" },
];

export const REGIONAL_ROUTE_GROUPS = [
  {
    title: "Центральная Россия",
    links: [
      { href: "/moskva/nizhniy-novgorod", label: "Москва — Нижний Новгород" },
      { href: "/moskva/yaroslavl", label: "Москва — Ярославль" },
      { href: "/moskva/tula", label: "Москва — Тула" },
      { href: "/moskva/ryazan", label: "Москва — Рязань" },
    ],
  },
  {
    title: "Поволжье",
    links: [
      { href: "/nizhniy-novgorod/kazan", label: "Нижний Новгород — Казань" },
      { href: "/kazan/samara", label: "Казань — Самара" },
      { href: "/cheboksary/kazan", label: "Чебоксары — Казань" },
      { href: "/kazan/yoshkar-ola", label: "Казань — Йошкар-Ола" },
    ],
  },
  {
    title: "Юг России",
    links: [
      { href: "/krasnodar/sochi", label: "Краснодар — Сочи" },
      { href: "/krasnodar/novorossiysk", label: "Краснодар — Новороссийск" },
      { href: "/krasnodar/anapa", label: "Краснодар — Анапа" },
      { href: "/krasnodar/rostov-na-donu", label: "Краснодар — Ростов-на-Дону" },
    ],
  },
  {
    title: "Урал",
    links: [
      { href: "/yekaterinburg/tyumen", label: "Екатеринбург — Тюмень" },
      { href: "/chelyabinsk/yekaterinburg", label: "Челябинск — Екатеринбург" },
      { href: "/chelyabinsk/ufa", label: "Челябинск — Уфа" },
      { href: "/chelyabinsk/perm", label: "Челябинск — Пермь" },
    ],
  },
];

export const TRUST_FACTS = [
  "Онлайн-заявка 24/7 — телефон, сайт, Telegram",
  "Стоимость подтверждаем до выезда, без сюрпризов",
  "Прямой маршрут без пересадок до нужного адреса",
  "Классы: стандарт, комфорт, бизнес, минивэн",
  "Детские кресла по запросу",
  "Встреча с табличкой при прилёте",
  "Безнал и закрывающие документы для организаций",
  "Поездки в Крым и новые регионы России",
];

export const TRUST_METRICS = [
  { value: "24/7", label: "принимаем заявки" },
  { value: "4", label: "класса авто" },
  { value: "РФ", label: "маршруты по России" },
];

/** Уникальные ссылки на keyword-лендинги — только индексируемые страницы */
export const KEYWORD_PAGE_LINKS = [
  { href: "/taxi-mezhgorod", label: "Такси межгород" },
  { href: "/taksi-mezhgorod", label: "Заказать такси межгород" },
  { href: "/transfer-v-aeroport", label: "Трансфер в аэропорт" },
  { href: "/transfer-iz-aeroporta", label: "Трансфер из аэропорта" },
  { href: "/taxi-v-aeroport", label: "Такси в аэропорт" },
];

export const BLOG_LINKS = [
  { href: "/blog/kak-zakazat-mezhdugorodnee-taksi", label: "Как заказать такси межгород" },
  { href: "/blog/transfer-v-aeroport-chto-nuzhno-znat", label: "Трансфер в аэропорт — советы" },
  { href: "/blog/mezhdugorodnee-taksi-ili-poezd", label: "Такси или поезд: что выгоднее?" },
  { href: "/blog/taksi-iz-moskvy-v-regiony", label: "Такси из Москвы в регионы" },
  { href: "/blog/taksi-v-novye-regiony-rf", label: "Трансферы в новые регионы РФ" },
  { href: "/blog", label: "Все статьи блога" },
];

/**
 * Блог-статьи с коммерческой привязкой — для вставки в коммерческие страницы.
 * Показывают, что читают клиенты перед заказом.
 */
export const BLOG_COMMERCIAL_LINKS = [
  { href: "/blog/kak-zakazat-mezhdugorodnee-taksi", label: "Как заказать такси межгород", service: "intercity" },
  { href: "/blog/transfer-v-aeroport-chto-nuzhno-znat", label: "Что взять с собой в трансфер", service: "airport" },
  { href: "/blog/mezhdugorodnee-taksi-ili-poezd", label: "Такси или поезд — сравниваем", service: "intercity" },
  { href: "/blog/taksi-iz-moskvy-v-regiony", label: "Маршруты из Москвы в регионы", service: "intercity" },
];

export const SOUTH_ROUTE_LINKS = [
  { href: "/krasnodar/sochi", label: "Краснодар — Сочи" },
  { href: "/krasnodar/simferopol", label: "Краснодар — Симферополь" },
  { href: "/rostov-na-donu/sochi", label: "Ростов-на-Дону — Сочи" },
  { href: "/rostov-na-donu/krasnodar", label: "Ростов-на-Дону — Краснодар" },
  { href: "/rostov-na-donu/simferopol", label: "Ростов-на-Дону — Симферополь" },
];

export const NEW_TERRITORIES_LINKS = [
  { href: "/donetsk", label: "Такси из Донецка" },
  { href: "/lugansk", label: "Такси из Луганска" },
  { href: "/simferopol", label: "Такси из Симферополя" },
  { href: "/sevastopol", label: "Такси из Севастополя" },
  { href: "/mariupol", label: "Такси из Мариуполя" },
];
