import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { aboutContent } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await db.select().from(aboutContent).get();
    return NextResponse.json({ success: true, data: row ?? null });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch about content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titleTh, titleEn, descriptionTh, descriptionEn } = body;

    const existing = await db.select().from(aboutContent).get();

    if (existing) {
      const result = await db
        .update(aboutContent)
        .set({ titleTh, titleEn, descriptionTh, descriptionEn })
        .where(eq(aboutContent.id, 1))
        .returning();
      revalidatePath("/th");
      revalidatePath("/en");
      revalidatePath("/");
      return NextResponse.json({ success: true, data: result[0] });
    } else {
      const result = await db
        .insert(aboutContent)
        .values({ id: 1, titleTh, titleEn, descriptionTh, descriptionEn })
        .returning();
      revalidatePath("/th");
      revalidatePath("/en");
      revalidatePath("/");
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update about content";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
