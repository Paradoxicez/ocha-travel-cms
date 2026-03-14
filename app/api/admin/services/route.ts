import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nameTh, nameEn, descriptionTh, descriptionEn, seatsTh, seatsEn, slug, active } = body;

    if (!nameTh || !nameEn || !descriptionTh || !descriptionEn || !slug) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db.insert(services).values({
      nameTh,
      nameEn,
      descriptionTh,
      descriptionEn,
      seatsTh: seatsTh || null,
      seatsEn: seatsEn || null,
      slug,
      active: active ?? 1,
    }).returning();

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create service";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
