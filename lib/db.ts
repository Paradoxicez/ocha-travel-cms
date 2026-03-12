import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATA_DIR
  ? `${process.env.DATA_DIR}/ocha.db`
  : "./data/ocha.db";

// Ensure directory exists
const dir = dirname(dbPath);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
