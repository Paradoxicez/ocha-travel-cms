import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { trustIndicators } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.select().from(trustIndicators).orderBy(asc(trustIndicators.sortOrder));
    return NextResponse.json({ success: true, data: rows });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch trust indicators" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { icon, value, labelTh, labelEn } = body;

    if (!icon || !value || !labelTh || !labelEn) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await db
      .insert(trustIndicators)
      .values({ icon, value, labelTh, labelEn })
      .returning();

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create trust indicator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
