import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { services, serviceImages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";
import { join } from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nameTh, nameEn, descriptionTh, descriptionEn, seatsTh, seatsEn, slug, active } = body;

    const result = await db
      .update(services)
      .set({
        ...(nameTh !== undefined && { nameTh }),
        ...(nameEn !== undefined && { nameEn }),
        ...(descriptionTh !== undefined && { descriptionTh }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(seatsTh !== undefined && { seatsTh }),
        ...(seatsEn !== undefined && { seatsEn }),
        ...(slug !== undefined && { slug }),
        ...(active !== undefined && { active }),
      })
      .where(eq(services.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update service";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const serviceId = Number(id);

    // Get all images for this service to delete files
    const images = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.serviceId, serviceId));

    // Delete image files from filesystem
    for (const image of images) {
      const filePath = join(DATA_DIR, image.imagePath);
      try {
        await unlink(filePath);
      } catch {
        // File may not exist, continue
      }
    }

    // Delete service (cascade will remove serviceImages rows)
    const result = await db
      .delete(services)
      .where(eq(services.id, serviceId))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 });
  }
}
