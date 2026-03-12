import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { serviceRegions } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.select().from(serviceRegions).orderBy(asc(serviceRegions.sortOrder));
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch service regions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nameTh, nameEn, provincesTh, provincesEn } = body;

    if (!nameTh || !nameEn || !provincesTh || !provincesEn) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db
      .insert(serviceRegions)
      .values({ nameTh, nameEn, provincesTh, provincesEn })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create service region";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
