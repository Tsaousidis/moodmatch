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

export type HomeRecommendation = {
  id: string;
  title: string;
  releaseYear: number | null;
  categoryName: string;
  categorySlug: string;
  type: string;
  matchScore: number;
  confidenceScore: number;
  reason: string;
};

export async function getHomeRecommendations(userId: string) {
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
      isOnboarded: false,
      perfectMatch: null,
      morePicks: [],
      tasteDna: null,
    };
  }

  const [catalog, favoriteRows, experiencedRows, latestTasteDna] =
    await Promise.all([
      ensurePopularItemsForCategoryIds(
        selectedCategories.map((category) => category.id)
      ),
      db
        .select({ itemId: userFavorites.itemId })
        .from(userFavorites)
        .where(eq(userFavorites.userId, userId)),
      db
        .select({ itemId: userAlreadyExperienced.itemId })
        .from(userAlreadyExperienced)
        .where(eq(userAlreadyExperienced.userId, userId)),
      getLatestTasteDna(userId),
    ]);

  const excludedIds = new Set([
    ...favoriteRows.map((row) => row.itemId),
    ...experiencedRows.map((row) => row.itemId),
  ]);
  const eligibleItems = catalog.filter((item) => !excludedIds.has(item.id));
  const candidates = eligibleItems.length > 0 ? eligibleItems : catalog;

  if (candidates.length === 0) {
    return {
      isOnboarded: true,
      perfectMatch: null,
      morePicks: [],
      tasteDna: latestTasteDna,
    };
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const startIndex = stableNumber(`${userId}:${dateKey}`) % candidates.length;
  const orderedCandidates = [
    ...candidates.slice(startIndex),
    ...candidates.slice(0, startIndex),
  ];

  const recommendations = orderedCandidates.slice(0, 7).map((item, index) => ({
    ...item,
    matchScore: Math.max(76, 94 - index * 3),
    confidenceScore: latestTasteDna ? Math.max(64, 86 - index * 2) : 58,
    reason: buildReason(item.categoryName, latestTasteDna?.traits),
  }));

  return {
    isOnboarded: true,
    perfectMatch: recommendations[0] ?? null,
    morePicks: recommendations.slice(1),
    tasteDna: latestTasteDna,
  };
}

function stableNumber(value: string) {
  return [...value].reduce((total, character) => {
    return (total * 31 + character.charCodeAt(0)) >>> 0;
  }, 7);
}

function buildReason(
  categoryName: string,
  traits: Record<string, unknown> | undefined
) {
  const anchors = readStringList(traits?.anchors);
  const recommendationStyle =
    typeof traits?.recommendationStyle === "string"
      ? traits.recommendationStyle
      : "balanced discovery";

  if (anchors.length > 0) {
    return `A ${categoryName.toLowerCase()} pick aligned with ${anchors
      .slice(0, 2)
      .join(" and ")}.`;
  }

  return `A ${categoryName.toLowerCase()} pick shaped around ${recommendationStyle.toLowerCase()}.`;
}

function readStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
