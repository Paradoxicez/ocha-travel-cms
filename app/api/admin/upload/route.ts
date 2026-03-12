import { NextResponse } from "next/server";
import { auth } from "@/auth";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

const DATA_DIR = process.env.DATA_DIR || "./data";
const UPLOAD_DIR = join(DATA_DIR, "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, and WebP files are allowed" },
        { status: 415 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be 5MB or less" },
        { status: 413 },
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.webp`;
    const filepath = join(UPLOAD_DIR, filename);

    // Process with Sharp: resize + convert to WebP
    const processed = await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    return NextResponse.json({
      success: true,
      data: {
        path: `/uploads/${filename}`,
        width: processed.width,
        height: processed.height,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}
