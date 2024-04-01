import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/lib/server/database/schemas/*",
  out: "./src/lib/server/database/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;