import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, items, savedItems, xpLog } from "@/lib/db/schema";

export async function getSavedItemIds(userId: string) {
  const rows = await db
    .select({ itemId: savedItems.itemId })
    .from(savedItems)
    .where(eq(savedItems.userId, userId));

  return new Set(rows.map((row) => row.itemId));
}

export async function getSavedItems(userId: string) {
  return db
    .select({
      itemId: items.id,
      title: items.title,
      subtitle: items.subtitle,
      description: items.description,
      releaseYear: items.releaseYear,
      type: items.type,
      categoryName: categories.name,
      moodTags: savedItems.moodTags,
      note: savedItems.note,
      savedAt: savedItems.createdAt,
    })
    .from(savedItems)
    .innerJoin(items, eq(savedItems.itemId, items.id))
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(savedItems.userId, userId))
    .orderBy(desc(savedItems.createdAt));
}

export async function toggleSavedItem(userId: string, itemId: string) {
  const [item] = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, itemId))
    .limit(1);

  if (!item) {
    throw new Error("Item not found.");
  }

  const [existing] = await db
    .select({ itemId: savedItems.itemId })
    .from(savedItems)
    .where(and(eq(savedItems.userId, userId), eq(savedItems.itemId, itemId)))
    .limit(1);

  if (existing) {
    await db
      .delete(savedItems)
      .where(and(eq(savedItems.userId, userId), eq(savedItems.itemId, itemId)));
    return { isSaved: false, xpAwarded: 0 };
  }

  await db.insert(savedItems).values({ userId, itemId });

  const [previousSave] = await db
    .select({ id: xpLog.id })
    .from(xpLog)
    .where(
      and(
        eq(xpLog.userId, userId),
        eq(xpLog.itemId, itemId),
        eq(xpLog.action, "save_item")
      )
    )
    .limit(1);

  if (!previousSave) {
    await db.insert(xpLog).values({
      userId,
      itemId,
      action: "save_item",
      points: 5,
    });
  }

  return { isSaved: true, xpAwarded: previousSave ? 0 : 5 };
}

export async function updateSavedItemMoods(
  userId: string,
  itemId: string,
  moodTags: string[]
) {
  const cleanTags = [...new Set(moodTags.map((tag) => tag.trim()))]
    .filter(Boolean)
    .slice(0, 8);

  const [updated] = await db
    .update(savedItems)
    .set({ moodTags: cleanTags })
    .where(and(eq(savedItems.userId, userId), eq(savedItems.itemId, itemId)))
    .returning({ moodTags: savedItems.moodTags });

  if (!updated) {
    throw new Error("Saved item not found.");
  }

  return updated;
}
