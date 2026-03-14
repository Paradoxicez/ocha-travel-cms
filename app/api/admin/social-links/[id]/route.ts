import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { socialLinks } from "@/lib/schema";
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
    const { platform, url, icon, active } = body;

    const result = await db
      .update(socialLinks)
      .set({
        ...(platform !== undefined && { platform }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(active !== undefined && { active }),
      })
      .where(eq(socialLinks.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Social link not found" }, { status: 404 });
    }

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true, data: result[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update social link";
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
      .delete(socialLinks)
      .where(eq(socialLinks.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ success: false, error: "Social link not found" }, { status: 404 });
    }

    revalidatePath("/th");
    revalidatePath("/en");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete social link" }, { status: 500 });
  }
}
