import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Вектор РФ — трансферы и поездки по России",
  description: "Трансферы по городу, межгород, аэропорты. По России.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${manrope.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
