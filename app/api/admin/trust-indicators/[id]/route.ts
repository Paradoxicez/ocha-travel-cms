import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { trustIndicators } from "@/lib/schema";
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
    const { icon, value, labelTh, labelEn, active } = body;

    const result = await db
      .update(trustIndicators)
      .set({
        ...(icon !== undefined && { icon }),
        ...(value !== undefined && { value }),
        ...(labelTh !== undefined && { labelTh }),
        ...(labelEn !== undefined && { labelEn }),
        ...(active !== undefined && { active }),
      })
      .where(eq(trustIndicators.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Trust indicator not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update trust indicator";
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
      .delete(trustIndicators)
      .where(eq(trustIndicators.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Trust indicator not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete trust indicator" }, { status: 500 });
  }
}
