import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, items, ratings } from "@/lib/db/schema";

export async function getRatingsLibrary(userId: string) {
  const history = await db
    .select({
      id: ratings.id,
      itemId: items.id,
      title: items.title,
      type: items.type,
      releaseYear: items.releaseYear,
      categoryName: categories.name,
      rating: ratings.rating,
      sentiment: ratings.sentiment,
      likedTraits: ratings.likedTraits,
      dislikedTraits: ratings.dislikedTraits,
      updatedAt: ratings.updatedAt,
    })
    .from(ratings)
    .innerJoin(items, eq(ratings.itemId, items.id))
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(ratings.userId, userId))
    .orderBy(desc(ratings.updatedAt));

  const ratedHistory = history.filter(
    (entry): entry is typeof entry & { rating: number } =>
      typeof entry.rating === "number"
  );
  const averageRating =
    ratedHistory.length > 0
      ? ratedHistory.reduce((total, entry) => total + entry.rating, 0) /
        ratedHistory.length
      : 0;
  const categoryStats = Object.values(
    ratedHistory.reduce<
      Record<
        string,
        { categoryName: string; count: number; ratingTotal: number }
      >
    >((stats, entry) => {
      const categoryName = entry.categoryName ?? "Uncategorized";
      const current = stats[categoryName] ?? {
        categoryName,
        count: 0,
        ratingTotal: 0,
      };

      stats[categoryName] = {
        categoryName,
        count: current.count + 1,
        ratingTotal: current.ratingTotal + entry.rating,
      };
      return stats;
    }, {})
  )
    .map((stat) => ({
      categoryName: stat.categoryName,
      count: stat.count,
      averageRating: stat.ratingTotal / stat.count,
    }))
    .sort((first, second) => second.count - first.count);

  return {
    history,
    stats: {
      totalRatings: ratedHistory.length,
      averageRating,
      fiveStarRatings: ratedHistory.filter((entry) => entry.rating === 5).length,
      categoryCount: categoryStats.length,
    },
    categoryStats,
  };
}
