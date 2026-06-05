import { desc, eq } from "drizzle-orm";

import { generateTasteDna } from "@/lib/ai/taste-dna";
import { db } from "@/lib/db";
import {
  categories,
  contentComfortSettings,
  items,
  tasteDna,
  tasteTags,
  userAlreadyExperienced,
  userCategories,
  userFavorites,
  userSliderDefaults,
} from "@/lib/db/schema";

export async function collectTasteDnaInput(userId: string) {
  const [
    categoryRows,
    favoriteRows,
    experiencedRows,
    tagRows,
    comfortRows,
    sliderRows,
  ] = await Promise.all([
    db
      .select({ name: categories.name })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(eq(userCategories.userId, userId)),
    db
      .select({ title: items.title })
      .from(userFavorites)
      .innerJoin(items, eq(userFavorites.itemId, items.id))
      .where(eq(userFavorites.userId, userId)),
    db
      .select({ title: items.title })
      .from(userAlreadyExperienced)
      .innerJoin(items, eq(userAlreadyExperienced.itemId, items.id))
      .where(eq(userAlreadyExperienced.userId, userId)),
    db
      .select({
        label: tasteTags.label,
        isConfirmed: tasteTags.isConfirmed,
        isRejected: tasteTags.isRejected,
      })
      .from(tasteTags)
      .where(eq(tasteTags.userId, userId)),
    db
      .select()
      .from(contentComfortSettings)
      .where(eq(contentComfortSettings.userId, userId))
      .orderBy(desc(contentComfortSettings.updatedAt))
      .limit(1),
    db
      .select()
      .from(userSliderDefaults)
      .where(eq(userSliderDefaults.userId, userId)),
  ]);

  return {
    categories: categoryRows.map((category) => category.name),
    favorites: favoriteRows.map((item) => item.title),
    alreadyExperienced: experiencedRows.map((item) => item.title),
    confirmedTags: tagRows
      .filter((tag) => tag.isConfirmed)
      .map((tag) => tag.label),
    rejectedTags: tagRows.filter((tag) => tag.isRejected).map((tag) => tag.label),
    comfortSettings: comfortRows[0] ?? null,
    sliders: sliderRows,
  };
}

export async function generateAndSaveTasteDna(userId: string) {
  const input = await collectTasteDnaInput(userId);
  const generated = await generateTasteDna(input);

  const [latestDna] = await db
    .select({ version: tasteDna.version })
    .from(tasteDna)
    .where(eq(tasteDna.userId, userId))
    .orderBy(desc(tasteDna.version))
    .limit(1);

  const [savedDna] = await db
    .insert(tasteDna)
    .values({
      userId,
      version: (latestDna?.version ?? 0) + 1,
      traits: generated.traits,
      summary: generated.summary,
      generatedBy: generated.traits.source,
    })
    .returning();

  return savedDna;
}

export async function getLatestTasteDna(userId: string) {
  const [latestDna] = await db
    .select()
    .from(tasteDna)
    .where(eq(tasteDna.userId, userId))
    .orderBy(desc(tasteDna.version))
    .limit(1);

  return latestDna ?? null;
}
