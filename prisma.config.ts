import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // ✅ Prisma 7: migrate deploy берёт URL отсюда
  // Для Neon лучше DIRECT_URL (прямое подключение), иначе fallback на DATABASE_URL
  datasource: {
    url: process.env.DIRECT_URL?.trim() ? env("DIRECT_URL") : env("DATABASE_URL"),
  },
});