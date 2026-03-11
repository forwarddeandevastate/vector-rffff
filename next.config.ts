import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://api.telegram.org",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Content-Security-Policy", value: cspDirectives },
];

// CORS — разрешаем только свой домен на публичных API
const ALLOWED_ORIGINS = [
  "https://vector-rf.ru",
  "https://www.vector-rf.ru",
];

const corsHeaders = (origin: string) => [
  { key: "Access-Control-Allow-Origin", value: origin },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type" },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.8.0.127", "[::1]"],
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      // Security headers на всех маршрутах
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // CORS на публичных API (в dev без проверки origin)
      ...(process.env.NODE_ENV === "production"
        ? ALLOWED_ORIGINS.map((origin) => ({
            source: "/api/(leads|reviews|distance|place)(.*)",
            headers: corsHeaders(origin),
          }))
        : [
            {
              source: "/api/(leads|reviews|distance|place)(.*)",
              headers: [
                { key: "Access-Control-Allow-Origin", value: "*" },
                { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
                { key: "Access-Control-Allow-Headers", value: "Content-Type" },
              ],
            },
          ]),
    ];
  },

  async redirects() {
    return [
      // www → non-www (основной домен без www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vector-rf.ru" }],
        destination: "https://vector-rf.ru/:path*",
        permanent: true,
      },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.htm", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
