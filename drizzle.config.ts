import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATA_DIR
      ? `${process.env.DATA_DIR}/ocha.db`
      : "./data/ocha.db",
  },
});
