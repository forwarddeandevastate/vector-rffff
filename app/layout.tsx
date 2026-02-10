import type { Metadata, Viewport } from "next";
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

// Если Яндекс.Вебмастер попросит meta verification — вставь код сюда:
const YANDEX_VERIFICATION = "";

// Контакты
const PHONE_E164 = "+78314233929";

// viewport отдельно (Next App Router)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    "трансфер из аэропорта",
    "такси по россии",
    "корпоративное такси",
    "аренда авто с водителем",
    "встреча в аэропорту",
    "междугородний трансфер",
  ],

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

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
            telephone: PHONE_E164,
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
          "Трансфер из аэропорта",
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
        telephone: PHONE_E164,
        address: {
          "@type": "PostalAddress",
          addressCountry: "RU",
        },
        priceRange: "₽₽",
      },
    ],
  };

  return (
    <html lang="ru-RU">
      <head>
        {YANDEX_VERIFICATION ? (
          <meta name="yandex-verification" content={YANDEX_VERIFICATION} />
        ) : null}

        {/* Schema.org JSON-LD */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Yandex.Metrika */}
        <Script
          id="yandex-metrika"
          strategy="beforeInteractive"
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

        {/* Untarget.ai */}
        <Script
          id="untarget-ai"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(s,o){s[o]=s[o]||function(){(s[o].d=s[o].d||[]).push(arguments);}}
)(window,'UntargetJS');
UntargetJS('ts', new Date());
UntargetJS('id', '7a2be');
            `,
          }}
        />
        <Script
          id="untarget-ai-src"
          strategy="afterInteractive"
          src="https://cdn.untarget.ai/untarget.min.o.js"
        />
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

        {children}
      </body>
    </html>
  );
}