import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { serviceRegions } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
    const { nameTh, nameEn, provincesTh, provincesEn, active } = body;

    const result = await db
      .update(serviceRegions)
      .set({
        ...(nameTh !== undefined && { nameTh }),
        ...(nameEn !== undefined && { nameEn }),
        ...(provincesTh !== undefined && { provincesTh }),
        ...(provincesEn !== undefined && { provincesEn }),
        ...(active !== undefined && { active }),
      })
      .where(eq(serviceRegions.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Service region not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update service region";
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
    const result = await db
      .delete(serviceRegions)
      .where(eq(serviceRegions.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Service region not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete service region" }, { status: 500 });
  }
}
