import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { serviceRegions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids } = (await request.json()) as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "ids must be a non-empty array" },
        { status: 400 },
      );
    }

    for (let i = 0; i < ids.length; i++) {
      await db
        .update(serviceRegions)
        .set({ sortOrder: i })
        .where(eq(serviceRegions.id, ids[i]));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to reorder service regions" }, { status: 500 });
  }
}
