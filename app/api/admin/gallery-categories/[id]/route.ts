import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryCategories, galleryImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nameTh, nameEn, slug } = body;

    const result = await db
      .update(galleryCategories)
      .set({ nameTh, nameEn, slug })
      .where(eq(galleryCategories.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update category";
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const categoryId = Number(id);

    // Get all images for this category so we can delete files
    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.categoryId, categoryId));

    // Delete image files from filesystem
    for (const image of images) {
      const filePath = join(DATA_DIR, image.imagePath);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    // Delete category (cascade will remove gallery_images rows)
    const result = await db
      .delete(galleryCategories)
      .where(eq(galleryCategories.id, categoryId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
