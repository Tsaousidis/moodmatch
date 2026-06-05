import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, tasteTags, userCategories } from "@/lib/db/schema";

const tagsByCategorySlug = {
  movies: ["Clever storytelling", "Strong atmosphere", "Memorable characters"],
  "tv-shows": ["Slow-burn arcs", "Comfortable pacing", "Sharp dialogue"],
  books: ["Immersive worlds", "Thoughtful themes", "Page-turning momentum"],
  "board-games": ["Table talk", "Strategic choices", "Easy to teach"],
  "video-games": ["Exploration", "Rewarding challenge", "Player freedom"],
} as const;

export async function ensureTasteTagSuggestions(userId: string) {
  const [existingTag] = await db
    .select({ id: tasteTags.id })
    .from(tasteTags)
    .where(eq(tasteTags.userId, userId))
    .limit(1);

  if (!existingTag) {
    const selectedCategories = await db
      .select({
        id: categories.id,
        slug: categories.slug,
      })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(eq(userCategories.userId, userId));

    const rows = selectedCategories.flatMap((category) => {
      const labels =
        tagsByCategorySlug[
          category.slug as keyof typeof tagsByCategorySlug
        ] ?? [];

      return labels.map((label, index) => ({
        userId,
        categoryId: category.id,
        label,
        confidence: String(0.9 - index * 0.1),
      }));
    });

    if (rows.length > 0) {
      await db.insert(tasteTags).values(rows);
    }
  }

  return db
    .select({
      id: tasteTags.id,
      label: tasteTags.label,
      confidence: tasteTags.confidence,
      isConfirmed: tasteTags.isConfirmed,
      isRejected: tasteTags.isRejected,
      categoryName: categories.name,
    })
    .from(tasteTags)
    .leftJoin(categories, eq(tasteTags.categoryId, categories.id))
    .where(eq(tasteTags.userId, userId))
    .orderBy(asc(categories.name), asc(tasteTags.label));
}

export async function hasSelectedCategories(userId: string) {
  const [selectedCategory] = await db
    .select({ categoryId: userCategories.categoryId })
    .from(userCategories)
    .where(eq(userCategories.userId, userId))
    .limit(1);

  return Boolean(selectedCategory);
}

export function tagBelongsToUser(userId: string, tagId: string) {
  return and(eq(tasteTags.userId, userId), eq(tasteTags.id, tagId));
}
