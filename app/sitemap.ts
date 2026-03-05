import type { MetadataRoute } from "next";
import { CITY_LANDINGS } from "@/lib/city-landings";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vector-rf.ru";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    // ✅ хабы (очень важны для SEO)
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },

    // ✅ новые страницы
    {
      url: `${baseUrl}/prices`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/requisites`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },

    // ✅ посадочные услуги
    {
      url: `${baseUrl}/city-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/airport-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/intercity-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/minivan-transfer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/corporate-taxi`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/corporate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ✅ контентные страницы
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },

    // ✅ юридические страницы (важны для доверия Яндекса)
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${baseUrl}/agreement`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${baseUrl}/personal-data`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // thanks лучше не пихать в sitemap (служебная страница)
    // {
    //   url: `${baseUrl}/thanks`,
    //   lastModified: now,
    //   changeFrequency: "yearly",
    //   priority: 0.2,
    // },
  ];

  // ✅ Городские лендинги /moskva, /kazan ... (под рекламу и SEO)
  const cityPages: MetadataRoute.Sitemap = CITY_LANDINGS.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // ✅ Только популярные маршруты (чтобы не раздувать sitemap тысячами URL)
  const popularRoutes: MetadataRoute.Sitemap = CITY_LANDINGS.flatMap((c) =>
    c.popularTo.slice(0, 10).map((to) => ({
      url: `${baseUrl}/${c.slug}/${to}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    }))
  );

  return [...staticPages, ...cityPages, ...popularRoutes];
}