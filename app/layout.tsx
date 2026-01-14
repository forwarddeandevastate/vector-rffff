import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Logo from "@/app/components/Logo";

const manrope = Manrope({
  subsets: ["cyrillic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Вектор РФ — трансферы и поездки",
  description: "Трансферы по городу, межгород и аэропорты по России",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${manrope.className} bg-slate-50 text-slate-900`}>
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Логотип */}
            <div className="flex items-center gap-3">
              <Logo />
            </div>

            {/* Контакты */}
            <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
              <a
                href="tel:+79000000000"
                className="hover:text-blue-600 transition"
              >
                +7 900 000-00-00
              </a>
              <a
                href="#lead"
                className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-2 text-white hover:opacity-95 transition"
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Вектор РФ. Все права защищены.
          </div>
        </footer>
      </body>
    </html>
  );
}
