// lib/city-landings.ts

export type CityLanding = {
  /** URL slug, e.g. /moskva */
  slug: string;
  /** Display name (nominative), e.g. Москва */
  name: string;
  /** Genitive for "из ...", e.g. Москвы */
  fromGenitive: string;
  /** Popular destination slugs (5) */
  popularTo: string[];
};

/**
 * Городские лендинги под рекламу/SEO: /moskva, /kazan, ...
 *
 * ВАЖНО: формы падежей — вручную, чтобы Title/H1 звучали по‑русски.
 */
export const CITY_LANDINGS: CityLanding[] = [
  { slug: "moskva", name: "Москва", fromGenitive: "Москвы", popularTo: ["sankt-peterburg", "kazan", "nizhniy-novgorod", "tver", "tula", "ryazan", "kaluga", "yaroslavl", "ivanovo", "smolensk"] },
  { slug: "sankt-peterburg", name: "Санкт‑Петербург", fromGenitive: "Санкт‑Петербурга", popularTo: ["moskva", "tver", "yaroslavl", "nizhniy-novgorod", "kazan", "velikiy-novgorod", "pskov", "smolensk", "kaluga", "tula"] },
  { slug: "kazan", name: "Казань", fromGenitive: "Казани", popularTo: ["moskva", "nizhniy-novgorod", "cheboksary", "yoshkar-ola", "samara", "ufa", "perm", "yekaterinburg", "saratov", "volgograd"] },
  { slug: "nizhniy-novgorod", name: "Нижний Новгород", fromGenitive: "Нижнего Новгорода", popularTo: ["moskva", "kazan", "cheboksary", "ivanovo", "yaroslavl", "tver", "tula", "ryazan", "smolensk", "kaluga"] },
  { slug: "yekaterinburg", name: "Екатеринбург", fromGenitive: "Екатеринбурга", popularTo: ["chelyabinsk", "tyumen", "perm", "ufa", "kazan", "samara", "saratov", "volgograd", "krasnodar", "moskva"] },
  { slug: "samara", name: "Самара", fromGenitive: "Самары", popularTo: ["tolyatti", "kazan", "ufa", "saratov", "volgograd", "perm", "yekaterinburg", "chelyabinsk", "voronezh", "moskva"] },
  { slug: "rostov-na-donu", name: "Ростов‑на‑Дону", fromGenitive: "Ростова‑на‑Дону", popularTo: ["krasnodar", "voronezh", "volgograd", "stavropol", "sochi", "saratov", "samara", "ufa", "kazan", "moskva"] },
  { slug: "krasnodar", name: "Краснодар", fromGenitive: "Краснодара", popularTo: ["sochi", "rostov-na-donu", "anapa", "novorossiysk", "stavropol", "volgograd", "voronezh", "saratov", "samara", "moskva"] },
  { slug: "voronezh", name: "Воронеж", fromGenitive: "Воронежа", popularTo: ["moskva", "lipetsk", "kursk", "belgorod", "rostov-na-donu", "tula", "ryazan", "tver", "kaluga", "smolensk"] },
  { slug: "ufa", name: "Уфа", fromGenitive: "Уфы", popularTo: ["kazan", "samara", "chelyabinsk", "perm", "yekaterinburg", "tyumen", "saratov", "volgograd", "voronezh", "moskva"] },
  { slug: "chelyabinsk", name: "Челябинск", fromGenitive: "Челябинска", popularTo: ["yekaterinburg", "ufa", "tyumen", "perm", "kazan", "samara", "saratov", "volgograd", "voronezh", "moskva"] },
  { slug: "perm", name: "Пермь", fromGenitive: "Перми", popularTo: ["yekaterinburg", "ufa", "chelyabinsk", "tyumen", "kazan", "samara", "saratov", "volgograd", "voronezh", "moskva"] },
  { slug: "volgograd", name: "Волгоград", fromGenitive: "Волгограда", popularTo: ["saratov", "voronezh", "rostov-na-donu", "samara", "krasnodar", "lipetsk", "kursk", "belgorod", "tula", "moskva"] },
  { slug: "saratov", name: "Саратов", fromGenitive: "Саратова", popularTo: ["samara", "volgograd", "kazan", "ufa", "moskva", "voronezh", "lipetsk", "tula", "ryazan", "tver"] },
  { slug: "tyumen", name: "Тюмень", fromGenitive: "Тюмени", popularTo: ["yekaterinburg", "chelyabinsk", "perm", "ufa", "kazan", "samara", "saratov", "volgograd", "voronezh", "moskva"] },
  { slug: "yaroslavl", name: "Ярославль", fromGenitive: "Ярославля", popularTo: ["moskva", "ivanovo", "kostroma", "tver", "ryazan", "tula", "kaluga", "smolensk", "nizhniy-novgorod", "kazan"] },
  { slug: "tula", name: "Тула", fromGenitive: "Тулы", popularTo: ["moskva", "ryazan", "kaluga", "orel", "kursk", "lipetsk", "voronezh", "tver", "smolensk", "ivanovo"] },
  { slug: "ryazan", name: "Рязань", fromGenitive: "Рязани", popularTo: ["moskva", "tula", "tver", "ivanovo", "kaluga", "orel", "kursk", "lipetsk", "voronezh", "smolensk"] },
  { slug: "tver", name: "Тверь", fromGenitive: "Твери", popularTo: ["moskva", "sankt-peterburg", "smolensk", "yaroslavl", "ryazan", "tula", "kaluga", "ivanovo", "nizhniy-novgorod", "kazan"] },
  { slug: "ivanovo", name: "Иваново", fromGenitive: "Иваново", popularTo: ["nizhniy-novgorod", "yaroslavl", "moskva", "kostroma", "ryazan", "tver", "tula", "kaluga", "smolensk", "kazan"] },
  { slug: "kaluga", name: "Калуга", fromGenitive: "Калуги", popularTo: ["moskva", "tula", "bryansk", "smolensk", "orel", "ryazan", "tver", "ivanovo", "yaroslavl", "voronezh"] },
  { slug: "kostroma", name: "Кострома", fromGenitive: "Костромы", popularTo: ["yaroslavl", "ivanovo", "moskva", "nizhniy-novgorod", "tver", "tula", "ryazan", "kaluga", "smolensk", "kazan"] },
  { slug: "belgorod", name: "Белгород", fromGenitive: "Белгорода", popularTo: ["kursk", "voronezh", "moskva", "lipetsk", "orel", "tula", "ryazan", "tver", "smolensk", "kaluga"] },
  { slug: "kursk", name: "Курск", fromGenitive: "Курска", popularTo: ["belgorod", "orel", "tula", "voronezh", "moskva", "lipetsk", "ryazan", "tver", "smolensk", "kaluga"] },
  { slug: "bryansk", name: "Брянск", fromGenitive: "Брянска", popularTo: ["moskva", "smolensk", "kaluga", "orel", "kursk", "tula", "ryazan", "tver", "voronezh", "lipetsk"] },
  { slug: "lipetsk", name: "Липецк", fromGenitive: "Липецка", popularTo: ["voronezh", "moskva", "tula", "ryazan", "kursk", "belgorod", "orel", "kaluga", "tver", "smolensk"] },
  { slug: "orel", name: "Орёл", fromGenitive: "Орла", popularTo: ["tula", "kursk", "bryansk", "kaluga", "moskva", "ryazan", "tver", "smolensk", "voronezh", "lipetsk"] },
  { slug: "cheboksary", name: "Чебоксары", fromGenitive: "Чебоксар", popularTo: ["kazan", "nizhniy-novgorod", "yoshkar-ola", "samara", "moskva", "ufa", "perm", "yekaterinburg", "saratov", "volgograd"] },
  { slug: "yoshkar-ola", name: "Йошкар‑Ола", fromGenitive: "Йошкар‑Олы", popularTo: ["kazan", "cheboksary", "nizhniy-novgorod", "samara", "moskva", "ufa", "perm", "yekaterinburg", "saratov", "volgograd"] },
  { slug: "smolensk", name: "Смоленск", fromGenitive: "Смоленска", popularTo: ["moskva", "tver", "kaluga", "bryansk", "orel", "tula", "ryazan", "yaroslavl", "ivanovo", "voronezh"] },
];

export const CITY_BY_SLUG = new Map(CITY_LANDINGS.map((c) => [c.slug, c] as const));
export const CITY_NAME_BY_SLUG = new Map<string, string>([
  ...CITY_LANDINGS.map((c) => [c.slug, c.name] as const),
  // доп. города, которые встречаются в "популярных" направлениях
  ["tolyatti", "Тольятти"],
  ["stavropol", "Ставрополь"],
  ["sochi", "Сочи"],
  ["anapa", "Анапа"],
  ["novorossiysk", "Новороссийск"],
  ["velikiy-novgorod", "Великий Новгород"],
  ["pskov", "Псков"],
]);

export function prettyCityNameFromSlug(slug: string) {
  return CITY_NAME_BY_SLUG.get(slug) ?? slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}
