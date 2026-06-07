import { desc, eq } from "drizzle-orm";

import { ensureDefaultCategories } from "@/lib/categories/defaults";
import { db } from "@/lib/db";
import {
  contentComfortSettings,
  userAlreadyExperienced,
  userCategories,
} from "@/lib/db/schema";
import { ensurePopularItemsForCategoryIds } from "@/lib/items/popular";

export async function getProfilePreferences(userId: string) {
  const [categoryOptions, selectedCategoryRows, comfortRows] = await Promise.all([
    ensureDefaultCategories(),
    db
      .select({ categoryId: userCategories.categoryId })
      .from(userCategories)
      .where(eq(userCategories.userId, userId)),
    db
      .select()
      .from(contentComfortSettings)
      .where(eq(contentComfortSettings.userId, userId))
      .orderBy(desc(contentComfortSettings.updatedAt))
      .limit(1),
  ]);

  const selectedCategoryIds = selectedCategoryRows.map(
    (category) => category.categoryId
  );
  const [itemOptions, experiencedRows] = await Promise.all([
    ensurePopularItemsForCategoryIds(selectedCategoryIds),
    db
      .select({ itemId: userAlreadyExperienced.itemId })
      .from(userAlreadyExperienced)
      .where(eq(userAlreadyExperienced.userId, userId)),
  ]);
  const comfort = comfortRows[0];

  return {
    categoryOptions,
    selectedCategoryIds,
    itemOptions,
    experiencedItemIds: experiencedRows.map((item) => item.itemId),
    comfortValues: comfort
      ? {
          avoidSpoilers: comfort.avoidSpoilers,
          avoidExplicitContent: comfort.avoidExplicitContent,
          avoidViolence: comfort.avoidViolence,
          avoidHorror: comfort.avoidHorror,
          avoidSadEndings: comfort.avoidSadEndings,
          customAvoidList: comfort.customAvoidList ?? [],
        }
      : {
          avoidSpoilers: true,
          avoidExplicitContent: false,
          avoidViolence: false,
          avoidHorror: false,
          avoidSadEndings: false,
          customAvoidList: [],
        },
  };
}
