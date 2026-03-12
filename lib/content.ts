import { db } from "./db";
import {
  siteSettings,
  heroContent,
  aboutContent,
  trustIndicators,
  services,
  serviceImages,
  galleryCategories,
  galleryImages,
  serviceRegions,
  contactInfo,
  socialLinks,
  seoMeta,
} from "./schema";
import { asc, eq } from "drizzle-orm";

export type Lang = "th" | "en";

function pick<T>(th: T, en: T, lang: Lang): T {
  return lang === "th" ? th : en;
}

export function getContent(lang: Lang) {
  const settings = db.select().from(siteSettings).get();
  const hero = db.select().from(heroContent).get();
  const about = db.select().from(aboutContent).get();

  const indicators = db
    .select()
    .from(trustIndicators)
    .where(eq(trustIndicators.active, 1))
    .orderBy(asc(trustIndicators.sortOrder))
    .all();

  const allServices = db
    .select()
    .from(services)
    .where(eq(services.active, 1))
    .orderBy(asc(services.sortOrder))
    .all();

  const servicesWithImages = allServices.map((s) => ({
    id: s.id,
    name: pick(s.nameTh, s.nameEn, lang),
    description: pick(s.descriptionTh, s.descriptionEn, lang),
    seats: pick(s.seatsTh, s.seatsEn, lang),
    slug: s.slug,
    images: db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.serviceId, s.id))
      .orderBy(asc(serviceImages.sortOrder))
      .all()
      .map((img) => img.imagePath),
  }));

  const categories = db
    .select()
    .from(galleryCategories)
    .where(eq(galleryCategories.active, 1))
    .orderBy(asc(galleryCategories.sortOrder))
    .all();

  const gallery = categories.map((c) => ({
    id: c.id,
    name: pick(c.nameTh, c.nameEn, lang),
    slug: c.slug,
    images: db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.categoryId, c.id))
      .orderBy(asc(galleryImages.sortOrder))
      .all()
      .map((img) => ({
        path: img.imagePath,
        alt: pick(img.altTh, img.altEn, lang),
      })),
  }));

  const regions = db
    .select()
    .from(serviceRegions)
    .where(eq(serviceRegions.active, 1))
    .orderBy(asc(serviceRegions.sortOrder))
    .all()
    .map((r) => ({
      id: r.id,
      name: pick(r.nameTh, r.nameEn, lang),
      provinces: JSON.parse(pick(r.provincesTh, r.provincesEn, lang)) as string[],
    }));

  const contact = db.select().from(contactInfo).get();
  const social = db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.active, 1))
    .orderBy(asc(socialLinks.sortOrder))
    .all();
  const seo = db.select().from(seoMeta).get();

  return {
    settings: settings
      ? {
          businessName: pick(settings.businessNameTh, settings.businessNameEn, lang),
          tagline: pick(settings.taglineTh, settings.taglineEn, lang),
          logoPath: settings.logoPath,
          primaryColor: settings.primaryColor,
        }
      : null,
    hero: hero
      ? {
          titleMain: pick(hero.titleMainTh, hero.titleMainEn, lang),
          titleAccent: pick(hero.titleAccentTh, hero.titleAccentEn, lang),
          subtitle: pick(hero.subtitleTh, hero.subtitleEn, lang),
          ctaText: pick(hero.ctaTextTh, hero.ctaTextEn, lang),
          bgImage: hero.bgImagePath,
        }
      : null,
    about: about
      ? {
          title: pick(about.titleTh, about.titleEn, lang),
          description: pick(about.descriptionTh, about.descriptionEn, lang),
          indicators: indicators.map((i) => ({
            icon: i.icon,
            value: i.value,
            label: pick(i.labelTh, i.labelEn, lang),
          })),
        }
      : null,
    services: servicesWithImages,
    gallery,
    regions,
    contact: contact
      ? {
          phone: contact.phone,
          address: pick(contact.addressTh, contact.addressEn, lang),
          email: contact.email,
        }
      : null,
    socialLinks: social,
    seo: seo
      ? {
          title: pick(seo.titleTh, seo.titleEn, lang),
          description: pick(seo.descriptionTh, seo.descriptionEn, lang),
          ogImage: seo.ogImagePath,
        }
      : null,
  };
}
