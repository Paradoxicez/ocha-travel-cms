import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryCategories, galleryImages } from "@/lib/schema";
import { eq, asc, count } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db
      .select({
        id: galleryCategories.id,
        nameTh: galleryCategories.nameTh,
        nameEn: galleryCategories.nameEn,
        slug: galleryCategories.slug,
        sortOrder: galleryCategories.sortOrder,
        active: galleryCategories.active,
        imageCount: count(galleryImages.id),
      })
      .from(galleryCategories)
      .leftJoin(galleryImages, eq(galleryCategories.id, galleryImages.categoryId))
      .groupBy(galleryCategories.id)
      .orderBy(asc(galleryCategories.sortOrder));

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nameTh, nameEn, slug } = body;

    if (!nameTh || !nameEn || !slug) {
      return NextResponse.json(
        { success: false, error: "nameTh, nameEn, and slug are required" },
        { status: 400 },
      );
    }

    // Get max sort order
    const existing = await db
      .select({ maxOrder: galleryCategories.sortOrder })
      .from(galleryCategories)
      .orderBy(asc(galleryCategories.sortOrder));

    const maxOrder = existing.length > 0
      ? Math.max(...existing.map((e) => e.maxOrder)) + 1
      : 0;

    const result = await db
      .insert(galleryCategories)
      .values({ nameTh, nameEn, slug, sortOrder: maxOrder })
      .returning();

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create category";
    if (message.includes("UNIQUE")) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
