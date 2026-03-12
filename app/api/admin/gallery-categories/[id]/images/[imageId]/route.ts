import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageId } = await params;

    // Get image to find file path
    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, Number(imageId)));

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 },
      );
    }

    const image = images[0];

    // Delete file from filesystem
    const filePath = join(DATA_DIR, image.imagePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete from database
    await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, Number(imageId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
