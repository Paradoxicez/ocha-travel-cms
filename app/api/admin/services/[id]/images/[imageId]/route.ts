import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { serviceImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageId } = await params;

    // Get image to find file path
    const rows = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.id, Number(imageId)));

    if (!rows.length) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    const image = rows[0];

    // Delete file from filesystem
    try {
      const filePath = join(DATA_DIR, image.imagePath);
      await unlink(filePath);
    } catch {
      // File may not exist, continue
    }

    // Delete database record
    await db.delete(serviceImages).where(eq(serviceImages.id, Number(imageId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete image" }, { status: 500 });
  }
}
