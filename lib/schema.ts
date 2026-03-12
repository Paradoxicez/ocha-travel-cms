import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamp = () =>
  text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`);

// ─── Admin Users ───────────────────────────────────────────
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: timestamp(),
});

// ─── Site Settings ─────────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  businessNameTh: text("business_name_th").notNull().default("โอชา ทราเวล ทรานสปอร์ต"),
  businessNameEn: text("business_name_en").notNull().default("Ocha Travel Transport"),
  taglineTh: text("tagline_th").notNull().default("ทราเวล ทรานสปอร์ต"),
  taglineEn: text("tagline_en").notNull().default("TRAVEL TRANSPORT"),
  logoPath: text("logo_path"),
  primaryColor: text("primary_color").notNull().default("#E11D48"),
  secondaryColor: text("secondary_color").notNull().default("#000000"),
  updatedAt: timestamp(),
});

// ─── Hero Content ──────────────────────────────────────────
export const heroContent = sqliteTable("hero_content", {
  id: integer("id").primaryKey().default(1),
  titleMainTh: text("title_main_th").notNull(),
  titleMainEn: text("title_main_en").notNull(),
  titleAccentTh: text("title_accent_th"),
  titleAccentEn: text("title_accent_en"),
  subtitleTh: text("subtitle_th").notNull(),
  subtitleEn: text("subtitle_en").notNull(),
  ctaTextTh: text("cta_text_th").notNull(),
  ctaTextEn: text("cta_text_en").notNull(),
  bgImagePath: text("bg_image_path"),
  updatedAt: timestamp(),
});

// ─── About Content ─────────────────────────────────────────
export const aboutContent = sqliteTable("about_content", {
  id: integer("id").primaryKey().default(1),
  titleTh: text("title_th").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionTh: text("description_th").notNull(),
  descriptionEn: text("description_en").notNull(),
  updatedAt: timestamp(),
});

// ─── Trust Indicators ──────────────────────────────────────
export const trustIndicators = sqliteTable("trust_indicators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  icon: text("icon").notNull(),
  value: text("value").notNull(),
  labelTh: text("label_th").notNull(),
  labelEn: text("label_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active").notNull().default(1),
});

// ─── Services ──────────────────────────────────────────────
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameTh: text("name_th").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionTh: text("description_th").notNull(),
  descriptionEn: text("description_en").notNull(),
  seatsTh: text("seats_th"),
  seatsEn: text("seats_en"),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: timestamp(),
});

// ─── Service Images ────────────────────────────────────────
export const serviceImages = sqliteTable("service_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  imagePath: text("image_path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Gallery Categories ────────────────────────────────────
export const galleryCategories = sqliteTable("gallery_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameTh: text("name_th").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active").notNull().default(1),
});

// ─── Gallery Images ────────────────────────────────────────
export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => galleryCategories.id, { onDelete: "cascade" }),
  imagePath: text("image_path").notNull(),
  altTh: text("alt_th"),
  altEn: text("alt_en"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Service Regions ───────────────────────────────────────
export const serviceRegions = sqliteTable("service_regions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameTh: text("name_th").notNull(),
  nameEn: text("name_en").notNull(),
  provincesTh: text("provinces_th").notNull(), // JSON array
  provincesEn: text("provinces_en").notNull(), // JSON array
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active").notNull().default(1),
});

// ─── Contact Info ──────────────────────────────────────────
export const contactInfo = sqliteTable("contact_info", {
  id: integer("id").primaryKey().default(1),
  phone: text("phone").notNull(),
  addressTh: text("address_th").notNull(),
  addressEn: text("address_en").notNull(),
  email: text("email").notNull(),
  updatedAt: timestamp(),
});

// ─── Social Links ──────────────────────────────────────────
export const socialLinks = sqliteTable("social_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active").notNull().default(1),
});

// ─── SEO Meta ──────────────────────────────────────────────
export const seoMeta = sqliteTable("seo_meta", {
  id: integer("id").primaryKey().default(1),
  titleTh: text("title_th").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionTh: text("description_th").notNull(),
  descriptionEn: text("description_en").notNull(),
  ogImagePath: text("og_image_path"),
  updatedAt: timestamp(),
});
