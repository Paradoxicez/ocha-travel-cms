import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contactInfo } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const row = await db.select().from(contactInfo).get();
    return NextResponse.json({ success: true, data: row ?? null });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch contact info" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, addressTh, addressEn, email } = body;

    const existing = await db.select().from(contactInfo).get();

    if (existing) {
      const result = await db
        .update(contactInfo)
        .set({ phone, addressTh, addressEn, email })
        .where(eq(contactInfo.id, 1))
        .returning();
      revalidatePath("/th");
      revalidatePath("/en");
      revalidatePath("/");
      return NextResponse.json({ success: true, data: result[0] });
    } else {
      const result = await db
        .insert(contactInfo)
        .values({ id: 1, phone, addressTh, addressEn, email })
        .returning();
      revalidatePath("/th");
      revalidatePath("/en");
      revalidatePath("/");
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update contact info";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
