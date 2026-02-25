import { defineConfig } from "prisma/config";

function must(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing ${name}`);
  return v.trim();
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  // Prisma 7: connection URL для migrate живёт здесь.
  // Для Neon: миграции лучше гонять через DIRECT_URL (не pooler).
  // Если DIRECT_URL не задан — fallback на DATABASE_URL.
  datasources: {
    db: {
      url: process.env.DIRECT_URL?.trim() || must("DATABASE_URL"),
    },
  },
});