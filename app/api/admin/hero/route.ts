import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { heroContent } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await db.select().from(heroContent).get();
    return NextResponse.json({ success: true, data: row ?? null });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch hero content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titleMainTh, titleMainEn, titleAccentTh, titleAccentEn, subtitleTh, subtitleEn, ctaTextTh, ctaTextEn, bgImagePath } = body;

    const existing = await db.select().from(heroContent).get();

    if (existing) {
      const result = await db
        .update(heroContent)
        .set({
          titleMainTh,
          titleMainEn,
          titleAccentTh: titleAccentTh || null,
          titleAccentEn: titleAccentEn || null,
          subtitleTh,
          subtitleEn,
          ctaTextTh,
          ctaTextEn,
          bgImagePath: bgImagePath || null,
        })
        .where(eq(heroContent.id, 1))
        .returning();
      return NextResponse.json({ success: true, data: result[0] });
    } else {
      const result = await db
        .insert(heroContent)
        .values({
          id: 1,
          titleMainTh,
          titleMainEn,
          titleAccentTh: titleAccentTh || null,
          titleAccentEn: titleAccentEn || null,
          subtitleTh,
          subtitleEn,
          ctaTextTh,
          ctaTextEn,
          bgImagePath: bgImagePath || null,
        })
        .returning();
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update hero content";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
