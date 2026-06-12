import { and, asc, eq, inArray } from "drizzle-orm";

import { ensureDefaultCategories } from "@/lib/categories/defaults";
import { db } from "@/lib/db";
import { categories, items } from "@/lib/db/schema";
import { enrichItems } from "@/lib/external/enrich-item";

const popularItemsByCategorySlug = {
  movies: [
    ["Everything Everywhere All at Once", 2022],
    ["Parasite", 2019],
    ["The Grand Budapest Hotel", 2014],
    ["Mad Max: Fury Road", 2015],
    ["Arrival", 2016],
    ["Knives Out", 2019],
    ["Spider-Man: Into the Spider-Verse", 2018],
    ["The Princess Bride", 1987],
  ],
  "tv-shows": [
    ["The Bear", 2022],
    ["Severance", 2022],
    ["Better Call Saul", 2015],
    ["Avatar: The Last Airbender", 2005],
    ["The Last of Us", 2023],
  ],
  books: [
    ["Project Hail Mary", 2021],
    ["Tomorrow, and Tomorrow, and Tomorrow", 2022],
    ["The Hobbit", 1937],
    ["Dune", 1965],
    ["Atomic Habits", 2018],
  ],
  "board-games": [
    ["Catan", null],
    ["Wingspan", null],
    ["Ticket to Ride", null],
    ["Codenames", null],
    ["Pandemic", null],
  ],
  "video-games": [
    ["The Legend of Zelda: Breath of the Wild", 2017],
    ["Hades", 2020],
    ["Stardew Valley", 2016],
    ["Baldur's Gate 3", 2023],
    ["Portal 2", 2011],
  ],
} as const;

export async function ensurePopularItemsForCategoryIds(categoryIds: string[]) {
  if (categoryIds.length === 0) {
    return [];
  }

  await ensureDefaultCategories();

  const selectedCategories = await db
    .select()
    .from(categories)
    .where(inArray(categories.id, categoryIds));

  for (const category of selectedCategories) {
    const popularItems =
      popularItemsByCategorySlug[
        category.slug as keyof typeof popularItemsByCategorySlug
      ] ?? [];

    for (const [title, releaseYear] of popularItems) {
      const [existingItem] = await db
        .select({ id: items.id })
        .from(items)
        .where(
          and(
            eq(items.categoryId, category.id),
            eq(items.title, title),
            eq(items.externalSource, "seed")
          )
        )
        .limit(1);

      if (existingItem) {
        continue;
      }

      await db
        .insert(items)
        .values({
          categoryId: category.id,
          type: category.itemType,
          title,
          releaseYear,
          externalSource: "seed",
          externalId: `${category.slug}:${title.toLowerCase().replaceAll(" ", "-")}`,
        })
        .onConflictDoNothing();
    }
  }

  const catalog = await db
    .select({
      id: items.id,
      title: items.title,
      releaseYear: items.releaseYear,
      categoryId: items.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      type: items.type,
      description: items.description,
      imageUrl: items.imageUrl,
      metadata: items.metadata,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(
      and(inArray(items.categoryId, categoryIds), eq(items.externalSource, "seed"))
    )
    .orderBy(asc(categories.name), asc(items.title));

  await enrichItems(catalog);

  return db
    .select({
      id: items.id,
      title: items.title,
      releaseYear: items.releaseYear,
      categoryId: items.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      type: items.type,
      description: items.description,
      imageUrl: items.imageUrl,
      metadata: items.metadata,
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(
      and(inArray(items.categoryId, categoryIds), eq(items.externalSource, "seed"))
    )
    .orderBy(asc(categories.name), asc(items.title));
}
