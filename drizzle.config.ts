import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" }); // read DATABASE_URL (never committed)

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing. Check .env.local");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", // generated SQL migrations go here
  dialect: "postgresql",
  dbCredentials: { url },
});