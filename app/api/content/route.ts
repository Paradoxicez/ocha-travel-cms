import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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
} from "@/lib/schema";
import { asc, eq } from "drizzle-orm";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET() {
  try {
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
      ...s,
      images: db
        .select()
        .from(serviceImages)
        .where(eq(serviceImages.serviceId, s.id))
        .orderBy(asc(serviceImages.sortOrder))
        .all(),
    }));

    const categories = db
      .select()
      .from(galleryCategories)
      .where(eq(galleryCategories.active, 1))
      .orderBy(asc(galleryCategories.sortOrder))
      .all();

    const galleryCatsWithImages = categories.map((c) => ({
      ...c,
      images: db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.categoryId, c.id))
        .orderBy(asc(galleryImages.sortOrder))
        .all(),
    }));

    const regions = db
      .select()
      .from(serviceRegions)
      .where(eq(serviceRegions.active, 1))
      .orderBy(asc(serviceRegions.sortOrder))
      .all();

    const contact = db.select().from(contactInfo).get();

    const social = db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.active, 1))
      .orderBy(asc(socialLinks.sortOrder))
      .all();

    const seo = db.select().from(seoMeta).get();

    return NextResponse.json({
      settings,
      hero,
      about: { ...about, indicators },
      services: servicesWithImages,
      gallery: galleryCatsWithImages,
      regions,
      contact,
      socialLinks: social,
      seo,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 },
    );
  }
}
