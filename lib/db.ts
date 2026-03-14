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
sqlite.pragma("busy_timeout = 5000");
sqlite.pragma("foreign_keys = ON");

// Auto-create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    business_name_th TEXT NOT NULL DEFAULT 'โอชา ทราเวล ทรานสปอร์ต',
    business_name_en TEXT NOT NULL DEFAULT 'Ocha Travel Transport',
    tagline_th TEXT NOT NULL DEFAULT 'ทราเวล ทรานสปอร์ต',
    tagline_en TEXT NOT NULL DEFAULT 'TRAVEL TRANSPORT',
    logo_path TEXT,
    primary_color TEXT NOT NULL DEFAULT '#E11D48',
    secondary_color TEXT NOT NULL DEFAULT '#000000',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hero_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title_main_th TEXT NOT NULL DEFAULT '',
    title_main_en TEXT NOT NULL DEFAULT '',
    title_accent_th TEXT,
    title_accent_en TEXT,
    subtitle_th TEXT NOT NULL DEFAULT '',
    subtitle_en TEXT NOT NULL DEFAULT '',
    cta_text_th TEXT NOT NULL DEFAULT '',
    cta_text_en TEXT NOT NULL DEFAULT '',
    bg_image_path TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title_th TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    description_th TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS trust_indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    value TEXT NOT NULL,
    label_th TEXT NOT NULL,
    label_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_th TEXT NOT NULL,
    description_en TEXT NOT NULL,
    seats_th TEXT,
    seats_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS service_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS gallery_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES gallery_categories(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL,
    alt_th TEXT,
    alt_en TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS service_regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    provinces_th TEXT NOT NULL,
    provinces_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    phone TEXT NOT NULL DEFAULT '',
    address_th TEXT NOT NULL DEFAULT '',
    address_en TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS seo_meta (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title_th TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    description_th TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    og_image_path TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export const db = drizzle(sqlite, { schema });
