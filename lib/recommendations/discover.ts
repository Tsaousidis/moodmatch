import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categories,
  userAlreadyExperienced,
  userCategories,
  userFavorites,
} from "@/lib/db/schema";
import { ensurePopularItemsForCategoryIds } from "@/lib/items/popular";
import { getLatestTasteDna } from "@/lib/onboarding/taste-dna";
import type { HomeRecommendation } from "@/lib/recommendations/home";
import { getSavedItemIds } from "@/lib/saved-items/service";

export type DiscoverFilters = {
  vibe: string;
  categoryId: string | null;
  novelty: number;
  comfort: number;
  energy: number;
};

export async function getDiscoverRecommendations(
  userId: string,
  filters: DiscoverFilters
) {
  const selectedCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(userCategories)
    .innerJoin(categories, eq(userCategories.categoryId, categories.id))
    .where(eq(userCategories.userId, userId));

  if (selectedCategories.length === 0) {
    return {
      categories: [],
      perfectMatch: null,
      recommendations: [],
    };
  }

  const activeCategories = filters.categoryId
    ? selectedCategories.filter((category) => category.id === filters.categoryId)
    : selectedCategories;
  const categoryIds = activeCategories.map((category) => category.id);
  const [catalog, favoriteRows, experiencedRows, latestTasteDna, savedItemIds] =
    await Promise.all([
      ensurePopularItemsForCategoryIds(categoryIds),
      db
        .select({ itemId: userFavorites.itemId })
        .from(userFavorites)
        .where(eq(userFavorites.userId, userId)),
      db
        .select({ itemId: userAlreadyExperienced.itemId })
        .from(userAlreadyExperienced)
        .where(eq(userAlreadyExperienced.userId, userId)),
      getLatestTasteDna(userId),
      getSavedItemIds(userId),
    ]);

  const excludedIds = new Set([
    ...favoriteRows.map((row) => row.itemId),
    ...experiencedRows.map((row) => row.itemId),
  ]);
  const eligibleItems = catalog.filter((item) => !excludedIds.has(item.id));
  const candidates = eligibleItems.length > 0 ? eligibleItems : catalog;
  const seed = `${userId}:${filters.vibe}:${filters.categoryId}:${filters.novelty}:${filters.comfort}:${filters.energy}`;
  const ranked = [...candidates].sort(
    (first, second) =>
      stableNumber(`${seed}:${second.title}`) -
      stableNumber(`${seed}:${first.title}`)
  );
  const vibe = filters.vibe.trim();
  const anchors = readStringList(latestTasteDna?.traits.anchors);
  const sliderConfidence = Math.round(
    (filters.novelty + filters.comfort + filters.energy) / 3
  );

  const recommendations: HomeRecommendation[] = ranked
    .slice(0, 7)
    .map((item, index) => ({
      ...item,
      matchScore: Math.max(74, 96 - index * 3),
      confidenceScore: Math.max(
        58,
        Math.min(94, (latestTasteDna ? 72 : 56) + Math.round(sliderConfidence / 8) - index)
      ),
      reason: vibe
        ? `Fits "${vibe}" through a ${describeSliderBalance(filters)} ${item.categoryName.toLowerCase()} direction.`
        : anchors.length > 0
          ? `Connects with ${anchors.slice(0, 2).join(" and ")} while staying ${describeSliderBalance(filters)}.`
          : `A ${describeSliderBalance(filters)} ${item.categoryName.toLowerCase()} pick for this search.`,
      isSaved: savedItemIds.has(item.id),
    }));

  return {
    categories: selectedCategories,
    perfectMatch: recommendations[0] ?? null,
    recommendations: recommendations.slice(1),
  };
}

function describeSliderBalance(filters: DiscoverFilters) {
  if (filters.novelty >= 67) return "fresh and exploratory";
  if (filters.comfort >= 67) return "comfortable and familiar";
  if (filters.energy >= 67) return "high-energy";
  return "balanced";
}

function stableNumber(value: string) {
  return [...value].reduce((total, character) => {
    return (total * 31 + character.charCodeAt(0)) >>> 0;
  }, 7);
}

function readStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
