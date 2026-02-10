import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.8.0.127", "[::1]"],

  async redirects() {
    return [
      // /index.html и /index.htm (и с любыми вложенными путями)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.htm", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
      { source: "/:path*/index.htm", destination: "/:path*", permanent: true },

      // Иногда встречается /home
      { source: "/home", destination: "/", permanent: true },

      // www -> без www (если вдруг прилетает на Next, а не на уровне DNS/прокси)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.vector-rf.ru" }],
        destination: "https://vector-rf.ru/:path*",
        permanent: true,
      },

      // http -> https для голого домена (если Next вообще видит http-трафик)
      // Обычно это делается на прокси/хостинге, но пусть будет как страховка.
      {
        source: "/:path*",
        has: [{ type: "host", value: "vector-rf.ru" }],
        destination: "https://vector-rf.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;