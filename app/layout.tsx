import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const SITE_URL = "https://vector-rf.ru";
const SITE_NAME = "Вектор РФ";
const YM_ID = 106629239;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Вектор РФ — трансферы и поездки по России",
    template: "%s | Вектор РФ",
  },

  description:
    "Трансферы по городу, межгород, аэропорты. Индивидуальные поездки по России. Комфорт, бизнес, минивэн. Онлайн-заявка 24/7.",

  keywords: [
    "трансфер",
    "междугороднее такси",
    "такси межгород",
    "трансфер в аэропорт",
    "такси по россии",
    "корпоративное такси",
    "аренда авто с водителем",
    "встреча в аэропорту",
    "междугородний трансфер",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Вектор РФ — трансферы и поездки по России",
    description:
      "Трансферы по городу, межгород, аэропорты. Комфортные поездки по России. Онлайн-заявка 24/7.",
    siteName: SITE_NAME,
    locale: "ru_RU",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Вектор РФ — трансферы и поездки по России",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Вектор РФ — трансферы и поездки по России",
    description:
      "Трансферы по городу, межгород, аэропорты. Комфортные поездки по России. Онлайн-заявка 24/7.",
    images: ["/og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ✅ Вот тут самое важное: подключаем иконки из /public
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+7-831-423-39-29",
            contactType: "customer service",
            availableLanguage: ["Russian"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ru-RU",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        name: "Трансферы и междугородние поездки",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Россия" },
        serviceType: [
          "Трансфер в аэропорт",
          "Междугороднее такси",
          "Корпоративное такси",
          "Аренда автомобиля с водителем",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: SITE_NAME,
        url: SITE_URL,
        telephone: "+7-831-423-39-29",
        address: { "@type": "PostalAddress", addressCountry: "RU" },
        priceRange: "₽₽",
      },
    ],
  };

  return (
    <html lang="ru">
      <head>
        {/* Schema.org JSON-LD */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Yandex.Metrika */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) { return; }
  }
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],
  k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');

ym(${YM_ID}, 'init', {
  webvisor:true,
  clickmap:true,
  accurateTrackBounce:true,
  trackLinks:true
});
            `,
          }}
        />
        {/* /Yandex.Metrika */}
      </head>

      <body className={`${manrope.className} bg-slate-50 text-slate-900`}>
        {/* Yandex.Metrika noscript */}
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YM_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika noscript */}

        {children}
      </body>
    </html>
  );
}