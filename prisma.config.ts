import { defineConfig } from "prisma/config";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
const DIRECT_URL = process.env.DIRECT_URL;

if (!DATABASE_URL) {
  throw new Error("Missing env DATABASE_URL");
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: DATABASE_URL,

    // DIRECT_URL делаем необязательным:
    // если не задан — используем DATABASE_URL
    directUrl: DIRECT_URL || DATABASE_URL,
  },
});
