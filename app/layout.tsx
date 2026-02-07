import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const YM_ID = 106629239;

// Можно оставить как есть, но лучше задать базу сайта (каноникал, OG)
// Если не хочешь — можно удалить metadataBase/alternates/openGraph/twitter/robots, ничего не сломается.
const SITE_URL = "https://vector-rf.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Вектор РФ — трансферы и поездки по России",
  description: "Трансферы по городу, межгород, аэропорты. По России.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Вектор РФ",
    title: "Вектор РФ — трансферы и поездки по России",
    description: "Трансферы по городу, межгород, аэропорты. По России.",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Вектор РФ — трансферы и поездки по России",
    description: "Трансферы по городу, межгород, аэропорты. По России.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
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
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

ym(${YM_ID}, 'init', {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
            `,
          }}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/${YM_ID}"
              style="position:absolute;left:-9999px"
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika */}
      </head>

      <body className={`${manrope.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}