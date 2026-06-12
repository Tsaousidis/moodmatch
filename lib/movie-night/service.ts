import { eq } from "drizzle-orm";

import { createGroupProfile } from "@/lib/ai/group-profile";
import { ensureDefaultCategories } from "@/lib/categories/defaults";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { ensurePopularItemsForCategoryIds } from "@/lib/items/popular";
import type { HomeRecommendation } from "@/lib/recommendations/home";
import { getSavedItemIds } from "@/lib/saved-items/service";

export type MovieNightInput = {
  tastes: string;
  alreadySeen: string;
  vibe: string;
  groupSize: number;
};

export async function getMovieNightRecommendations(
  userId: string,
  input: MovieNightInput
) {
  await ensureDefaultCategories();

  const [movieCategory] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, "movies"))
    .limit(1);

  if (!movieCategory) {
    throw new Error("Movie category is unavailable.");
  }

  const [catalog, profile, savedItemIds] = await Promise.all([
    ensurePopularItemsForCategoryIds([movieCategory.id]),
    createGroupProfile({
      tastes: input.tastes,
      vibe: input.vibe,
      groupSize: input.groupSize,
    }),
    getSavedItemIds(userId),
  ]);

  const seenTitles = input.alreadySeen
    .toLowerCase()
    .split(/[\n,;]/)
    .map((title) => title.trim())
    .filter(Boolean);
  const unseen = catalog.filter(
    (item) =>
      !seenTitles.some(
        (seen) =>
          item.title.toLowerCase().includes(seen) ||
          seen.includes(item.title.toLowerCase())
      )
  );
  const candidates = unseen.length >= 4 ? unseen : catalog;
  const seed = `${userId}:${input.tastes}:${input.vibe}:${input.groupSize}`;
  const ranked = [...candidates].sort(
    (first, second) =>
      stableNumber(`${seed}:${second.title}`) -
      stableNumber(`${seed}:${first.title}`)
  );

  const picks = ranked.slice(0, 6).map((item, index) =>
    toRecommendation(item, index, input, savedItemIds.has(item.id))
  );

  return {
    profile,
    perfectPick: picks[0] ?? null,
    safePicks: picks.slice(1, 3),
    compromisePicks: picks.slice(3, 5),
    wildcard: picks[5] ?? picks.at(-1) ?? null,
  };
}

function toRecommendation(
  item: Awaited<ReturnType<typeof ensurePopularItemsForCategoryIds>>[number],
  index: number,
  input: MovieNightInput,
  isSaved: boolean
): HomeRecommendation {
  const role =
    index === 0
      ? "the strongest shared fit"
      : index < 3
        ? "a safe pick with broad appeal"
        : index < 5
          ? "a compromise between different tastes"
          : "the wildcard that could make the night memorable";

  return {
    ...item,
    matchScore: Math.max(72, 95 - index * 4),
    confidenceScore: Math.max(62, 88 - index * 3),
    reason: `For this ${input.vibe.toLowerCase()} group, this is ${role}.`,
    isSaved,
  };
}

function stableNumber(value: string) {
  return [...value].reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) >>> 0,
    7
  );
}
