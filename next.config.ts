import type { NextConfig } from "next";

const securityHeaders = [
  // Запрет встраивания в iframe (защита от clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Браузер не угадывает MIME-тип (защита от MIME sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer при переходе на другой домен — только origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Разрешаем только нужные API браузера
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
  // HSTS: браузер всегда ходит по HTTPS (1 год)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // XSS Protection (legacy браузеры)
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.8.0.127", "[::1]"],

  async headers() {
    return [
      {
        // Применяем ко всем маршрутам
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Закрываем хвосты вида /index.html (Google часто такое находит)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.htm", destination: "/", permanent: true },

      // Иногда встречается /home
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;