/**
 * breadcrumbs-jsonld.tsx — Server utility.
 * 
 * Глобальный клиентский BreadcrumbList удалён.
 * Каждая страница рендерит собственный breadcrumb серверно через buildBreadcrumbJsonLd() из lib/seo.ts.
 * 
 * Этот файл сохранён для обратной совместимости как no-op.
 * Если где-то ещё импортируется — вернёт null.
 */
export default function BreadcrumbsJsonLd(_: { siteUrl: string }) {
  return null;
}

/**
 * Карта человекочитаемых названий для URL-сегментов.
 * Используется в серверном коде если нужно prettify slug.
 */
export const SEGMENT_NAMES: Record<string, string> = {
  about: "О компании",
  services: "Услуги",
  reviews: "Отзывы",
  faq: "Вопросы",
  contacts: "Контакты",
  corporate: "Корпоративным",
  prices: "Цены",
  requisites: "Реквизиты",
  blog: "Блог",
  "sitemap-page": "Карта сайта",
  agreement: "Договор",
  privacy: "Конфиденциальность",
  thanks: "Спасибо",
  "taxi-mezhgorod": "Такси межгород",
  "taksi-mezhgorod": "Такси межгород",
  "mezhdugorodnee-taksi": "Междугороднее такси",
  "transfer-v-aeroport": "Трансфер в аэропорт",
  "transfer-iz-aeroporta": "Трансфер из аэропорта",
  "taxi-v-aeroport": "Такси в аэропорт",
  "city-transfer": "Поездки по городу",
  "minivan-transfer": "Минивэн",
  "intercity-taxi": "Такси межгород",
  "corporate-taxi": "Корпоративное такси",
  "airport-transfer": "Трансфер в аэропорт",
  city: "Города",
  route: "Маршруты",
};
