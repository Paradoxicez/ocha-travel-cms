import { db } from "../lib/db";
import {
  siteSettings,
  heroContent,
  aboutContent,
  trustIndicators,
  services,
  galleryCategories,
  galleryImages,
  serviceRegions,
  contactInfo,
  socialLinks,
  seoMeta,
} from "../lib/schema";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// ─── Load dictionaries ───────────────────────────────────────
const th = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dictionaries/th.json"), "utf-8")
);
const en = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dictionaries/en.json"), "utf-8")
);

// ─── Helper: scan image files from a directory ───────────────
function scanImages(dirPath: string): string[] {
  const fullPath = path.join(__dirname, "..", dirPath);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/${dirPath}/${f}`);
}

// ─── Gallery category mapping ────────────────────────────────
const galleryCategoryMap: Record<
  string,
  { nameTh: string; nameEn: string; dir: string }
> = {
  general: {
    nameTh: th.portfolio.tabs.general,
    nameEn: en.portfolio.tabs.general,
    dir: "pics/performance/Pick-up and drop-off-service",
  },
  transport: {
    nameTh: th.portfolio.tabs.transport,
    nameEn: en.portfolio.tabs.transport,
    dir: "pics/performance/transport-service",
  },
  van: {
    nameTh: th.portfolio.tabs.van,
    nameEn: en.portfolio.tabs.van,
    dir: "pics/performance/van-service",
  },
};

// ─── Indicator icon mapping ──────────────────────────────────
const indicatorIcons: Record<string, string> = {
  experience: "Clock",
  trips: "MapPin",
  availability: "Shield",
  coverage: "Globe",
};

async function seed() {
  console.log("🌱 Starting seed from JSON dictionaries...\n");

  // ─── 1. Site Settings ────────────────────────────────────
  console.log("  → Seeding siteSettings...");
  db.run(sql`DELETE FROM site_settings`);
  db.insert(siteSettings)
    .values({
      id: 1,
      businessNameTh: `${th.brand.name} ${th.brand.tagline}`,
      businessNameEn: `${en.brand.name} ${en.brand.tagline}`,
      taglineTh: th.brand.tagline,
      taglineEn: en.brand.tagline,
    })
    .run();
  console.log("    ✓ siteSettings done");

  // ─── 2. Hero Content ────────────────────────────────────
  console.log("  → Seeding heroContent...");
  db.run(sql`DELETE FROM hero_content`);
  db.insert(heroContent)
    .values({
      id: 1,
      titleMainTh: th.hero.title,
      titleMainEn: en.hero.title,
      titleAccentTh: th.hero.badge,
      titleAccentEn: en.hero.badge,
      subtitleTh: th.hero.tagline,
      subtitleEn: en.hero.tagline,
      ctaTextTh: th.hero.cta,
      ctaTextEn: en.hero.cta,
    })
    .run();
  console.log("    ✓ heroContent done");

  // ─── 3. About Content ───────────────────────────────────
  console.log("  → Seeding aboutContent...");
  db.run(sql`DELETE FROM about_content`);
  db.insert(aboutContent)
    .values({
      id: 1,
      titleTh: th.about.title,
      titleEn: en.about.title,
      descriptionTh: th.about.description,
      descriptionEn: en.about.description,
    })
    .run();
  console.log("    ✓ aboutContent done");

  // ─── 4. Trust Indicators ────────────────────────────────
  console.log("  → Seeding trustIndicators...");
  db.run(sql`DELETE FROM trust_indicators`);
  const indicatorKeys = Object.keys(th.about.indicators);
  for (let i = 0; i < indicatorKeys.length; i++) {
    const key = indicatorKeys[i];
    db.insert(trustIndicators)
      .values({
        icon: indicatorIcons[key] || "Star",
        value: th.about.indicators[key].value,
        labelTh: th.about.indicators[key].label,
        labelEn: en.about.indicators[key].label,
        sortOrder: i,
        active: 1,
      })
      .run();
  }
  console.log(`    ✓ trustIndicators done (${indicatorKeys.length} rows)`);

  // ─── 5. Services ────────────────────────────────────────
  console.log("  → Seeding services...");
  db.run(sql`DELETE FROM services`);
  for (let i = 0; i < th.services.items.length; i++) {
    const thItem = th.services.items[i];
    const enItem = en.services.items[i];
    db.insert(services)
      .values({
        nameTh: thItem.name,
        nameEn: enItem.name,
        descriptionTh: thItem.description,
        descriptionEn: enItem.description,
        seatsTh: thItem.seats,
        seatsEn: enItem.seats,
        slug: thItem.id,
        sortOrder: i,
        active: 1,
      })
      .run();
  }
  console.log(`    ✓ services done (${th.services.items.length} rows)`);

  // ─── 6. Gallery Categories + Images ─────────────────────
  console.log("  → Seeding galleryCategories + galleryImages...");
  db.run(sql`DELETE FROM gallery_images`);
  db.run(sql`DELETE FROM gallery_categories`);

  let totalImages = 0;
  const categorySlugs = Object.keys(galleryCategoryMap);

  for (let i = 0; i < categorySlugs.length; i++) {
    const slug = categorySlugs[i];
    const cat = galleryCategoryMap[slug];

    const result = db
      .insert(galleryCategories)
      .values({
        nameTh: cat.nameTh,
        nameEn: cat.nameEn,
        slug,
        sortOrder: i,
        active: 1,
      })
      .returning({ id: galleryCategories.id })
      .get();

    const categoryId = result.id;
    const images = scanImages(cat.dir);

    for (let j = 0; j < images.length; j++) {
      db.insert(galleryImages)
        .values({
          categoryId,
          imagePath: images[j],
          altTh: th.portfolio.alt[slug] || null,
          altEn: en.portfolio.alt[slug] || null,
          sortOrder: j,
        })
        .run();
    }

    totalImages += images.length;
    console.log(`    ✓ category "${slug}" — ${images.length} images`);
  }
  console.log(
    `    ✓ galleryCategories + galleryImages done (${categorySlugs.length} categories, ${totalImages} images)`
  );

  // ─── 7. Service Regions ─────────────────────────────────
  console.log("  → Seeding serviceRegions...");
  db.run(sql`DELETE FROM service_regions`);
  for (let i = 0; i < th.serviceAreas.regions.length; i++) {
    const thRegion = th.serviceAreas.regions[i];
    const enRegion = en.serviceAreas.regions[i];
    db.insert(serviceRegions)
      .values({
        nameTh: thRegion.name,
        nameEn: enRegion.name,
        provincesTh: JSON.stringify(thRegion.areas),
        provincesEn: JSON.stringify(enRegion.areas),
        sortOrder: i,
        active: 1,
      })
      .run();
  }
  console.log(
    `    ✓ serviceRegions done (${th.serviceAreas.regions.length} rows)`
  );

  // ─── 8. Contact Info ────────────────────────────────────
  console.log("  → Seeding contactInfo...");
  db.run(sql`DELETE FROM contact_info`);
  db.insert(contactInfo)
    .values({
      id: 1,
      phone: "0661244999",
      addressTh: th.footer.address,
      addressEn: en.footer.address,
      email: process.env.CONTACT_EMAIL || "contact@ochatravel.com",
    })
    .run();
  console.log("    ✓ contactInfo done");

  // ─── 9. Social Links ───────────────────────────────────
  console.log("  → Seeding socialLinks...");
  db.run(sql`DELETE FROM social_links`);

  const socials = [
    { platform: "Line", url: process.env.NEXT_PUBLIC_LINE_URL || "https://lin.ee/A1kdeUD" },
    { platform: "Facebook", url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/Ocha.Jirasak/" },
    { platform: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/mr.ocha999" },
    { platform: "WhatsApp", url: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/66661244999" },
    { platform: "Messenger", url: process.env.NEXT_PUBLIC_MESSENGER_URL || "https://m.me/Ocha.Jirasak/" },
    { platform: "WeChat", url: "_ochatravel_999" },
    { platform: "Telegram", url: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/Ochataxiservice999" },
  ];

  for (let i = 0; i < socials.length; i++) {
    db.insert(socialLinks)
      .values({
        platform: socials[i].platform,
        url: socials[i].url,
        sortOrder: i,
        active: 1,
      })
      .run();
  }
  console.log(`    ✓ socialLinks done (${socials.length} rows)`);

  // ─── 10. SEO Meta ──────────────────────────────────────
  console.log("  → Seeding seoMeta...");
  db.run(sql`DELETE FROM seo_meta`);
  db.insert(seoMeta)
    .values({
      id: 1,
      titleTh: th.meta.title,
      titleEn: en.meta.title,
      descriptionTh: th.meta.description,
      descriptionEn: en.meta.description,
    })
    .run();
  console.log("    ✓ seoMeta done");

  console.log("\n🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
