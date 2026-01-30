import { defineConfig, env } from "prisma/config";

// Если у тебя dotenv уже подключается где-то в проекте — можно убрать следующую строку.
// Но она не мешает, и локально удобно.
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // DATABASE_URL — основной (обычно pooled/обычный), используется Prisma CLI и клиентом через config
    url: env("DATABASE_URL"),

    // DIRECT_URL — прямое подключение (обычно unpooled) для миграций/DDL
    // Если DIRECT_URL не задан — просто удали эту строку.
    directUrl: env("DIRECT_URL"),
  },
});
