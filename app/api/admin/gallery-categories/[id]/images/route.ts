import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.categoryId, Number(id)))
      .orderBy(asc(galleryImages.sortOrder));

    return NextResponse.json({ success: true, data: images });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryId = Number(id);
    const body = await request.json();
    const { imagePath, altTh, altEn } = body;

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: "imagePath is required" },
        { status: 400 },
      );
    }

    // Get max sort order for this category
    const existing = await db
      .select({ sortOrder: galleryImages.sortOrder })
      .from(galleryImages)
      .where(eq(galleryImages.categoryId, categoryId));

    const maxOrder = existing.length > 0
      ? Math.max(...existing.map((e) => e.sortOrder)) + 1
      : 0;

    const result = await db
      .insert(galleryImages)
      .values({
        categoryId,
        imagePath,
        altTh: altTh || null,
        altEn: altEn || null,
        sortOrder: maxOrder,
      })
      .returning();

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add image" },
      { status: 500 },
    );
  }
}
