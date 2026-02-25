import { defineConfig } from "prisma/config";

function pickUrl() {
  // Для migrate deploy лучше DIRECT_URL (прямое подключение), если есть.
  const direct = process.env.DIRECT_URL?.trim();
  if (direct) return direct;

  const pooled = process.env.DATABASE_URL?.trim();
  if (pooled) return pooled;

  // Чтобы ошибка была понятной в логах Vercel
  throw new Error("Missing DATABASE_URL (and DIRECT_URL). Set it in Vercel Environment Variables.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasources: {
    db: {
      url: pickUrl(),
    },
  },
});