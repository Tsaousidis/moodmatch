import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export const defaultCategories: (typeof categories.$inferInsert)[] = [
  {
    slug: "movies",
    name: "Movies",
    itemType: "movie",
    description: "Films for every mood, era, and level of intensity.",
  },
  {
    slug: "tv-shows",
    name: "TV Shows",
    itemType: "tv_show",
    description: "Series, limited runs, comfort rewatches, and prestige picks.",
  },
  {
    slug: "books",
    name: "Books",
    itemType: "book",
    description: "Fiction and nonfiction that match your curiosity and pace.",
  },
  {
    slug: "board-games",
    name: "Board Games",
    itemType: "board_game",
    description: "Tabletop picks for solo play, groups, strategy, and party nights.",
  },
  {
    slug: "video-games",
    name: "Video Games",
    itemType: "video_game",
    description: "Interactive worlds shaped by challenge, story, and play style.",
  },
];

export async function ensureDefaultCategories() {
  await db
    .insert(categories)
    .values(defaultCategories)
    .onConflictDoNothing({ target: categories.slug });

  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.name));
}
