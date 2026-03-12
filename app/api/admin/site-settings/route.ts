import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await db.select().from(siteSettings).get();
    return NextResponse.json({ success: true, data: row ?? null });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { businessNameTh, businessNameEn, taglineTh, taglineEn, logoPath, primaryColor, secondaryColor } = body;

    const existing = await db.select().from(siteSettings).get();

    if (existing) {
      const result = await db
        .update(siteSettings)
        .set({
          businessNameTh,
          businessNameEn,
          taglineTh,
          taglineEn,
          logoPath: logoPath || null,
          primaryColor,
          secondaryColor,
        })
        .where(eq(siteSettings.id, 1))
        .returning();
      return NextResponse.json({ success: true, data: result[0] });
    } else {
      const result = await db
        .insert(siteSettings)
        .values({
          id: 1,
          businessNameTh,
          businessNameEn,
          taglineTh,
          taglineEn,
          logoPath: logoPath || null,
          primaryColor,
          secondaryColor,
        })
        .returning();
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update site settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
