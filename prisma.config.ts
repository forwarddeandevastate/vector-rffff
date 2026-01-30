import { defineConfig } from "prisma/config";

export default defineConfig({
  // Prisma 7: connection URLs больше не задаются в schema.prisma.
  // Здесь достаточно одного url.
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
