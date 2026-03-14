import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { serviceImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.serviceId, Number(id)))
      .orderBy(asc(serviceImages.sortOrder));

    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: "imagePath is required" },
        { status: 400 },
      );
    }

    // Get the next sort order
    const existing = await db
      .select()
      .from(serviceImages)
      .where(eq(serviceImages.serviceId, Number(id)));

    const sortOrder = existing.length;

    const result = await db
      .insert(serviceImages)
      .values({
        serviceId: Number(id),
        imagePath,
        sortOrder,
      })
      .returning();

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add image" }, { status: 500 });
  }
}
