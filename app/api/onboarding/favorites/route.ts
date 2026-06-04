import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, inArray } from "drizzle-orm";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { items, userFavorites } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { itemIds?: unknown };
  const itemIds = Array.isArray(body.itemIds)
    ? [
        ...new Set(
          body.itemIds.filter((id): id is string => typeof id === "string")
        ),
      ]
    : [];

  if (itemIds.length === 0) {
    return NextResponse.json(
      { error: "Select at least one favorite." },
      { status: 400 }
    );
  }

  const validItems = await db
    .select({ id: items.id })
    .from(items)
    .where(inArray(items.id, itemIds));

  const validItemIds = validItems.map((item) => item.id);

  if (validItemIds.length === 0) {
    return NextResponse.json(
      { error: "No valid favorites selected." },
      { status: 400 }
    );
  }

  await db.delete(userFavorites).where(eq(userFavorites.userId, session.user.id));

  await db.insert(userFavorites).values(
    validItemIds.map((itemId) => ({
      userId: session.user.id,
      itemId,
    }))
  );

  return NextResponse.json({ itemIds: validItemIds });
}
