import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vector-rf.ru";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // служебные/админские части можно закрыть при желании, но сейчас не трогаем
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
