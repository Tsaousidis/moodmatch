import { desc, eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { items, ratings, tasteDna, xpLog } from "@/lib/db/schema";

type RatingInput = {
  userId: string;
  itemId: string;
  rating: number;
  likedTraits: string[];
  dislikedTraits: string[];
};

export async function saveRating(input: RatingInput) {
  const [item] = await db
    .select({ id: items.id, title: items.title, type: items.type })
    .from(items)
    .where(eq(items.id, input.itemId))
    .limit(1);

  if (!item) {
    throw new Error("Item not found.");
  }

  const [existingRating] = await db
    .select({ id: ratings.id })
    .from(ratings)
    .where(
      and(eq(ratings.userId, input.userId), eq(ratings.itemId, input.itemId))
    )
    .orderBy(desc(ratings.updatedAt))
    .limit(1);

  const sentiment = ratingToSentiment(input.rating);

  if (existingRating) {
    await db
      .update(ratings)
      .set({
        rating: input.rating,
        sentiment,
        likedTraits: input.likedTraits,
        dislikedTraits: input.dislikedTraits,
        updatedAt: new Date(),
      })
      .where(eq(ratings.id, existingRating.id));
  } else {
    await db.insert(ratings).values({
      userId: input.userId,
      itemId: input.itemId,
      rating: input.rating,
      sentiment,
      likedTraits: input.likedTraits,
      dislikedTraits: input.dislikedTraits,
    });

    await db.insert(xpLog).values({
      userId: input.userId,
      itemId: input.itemId,
      action: "rate_item",
      points: 10,
      metadata: { rating: input.rating },
    });
  }

  const tasteDnaVersion = await updateTasteDnaFromRating(input, item.title);

  return {
    xpAwarded: existingRating ? 0 : 10,
    tasteDnaVersion,
  };
}

async function updateTasteDnaFromRating(input: RatingInput, itemTitle: string) {
  const [latestDna] = await db
    .select()
    .from(tasteDna)
    .where(eq(tasteDna.userId, input.userId))
    .orderBy(desc(tasteDna.version))
    .limit(1);

  if (!latestDna) {
    return null;
  }

  const previousSignals = Array.isArray(latestDna.traits.ratingSignals)
    ? latestDna.traits.ratingSignals.filter(
        (signal): signal is Record<string, unknown> =>
          typeof signal === "object" && signal !== null
      )
    : [];
  const ratingSignals = [
    ...previousSignals.filter((signal) => signal.itemId !== input.itemId),
    {
      itemId: input.itemId,
      title: itemTitle,
      rating: input.rating,
      likedTraits: input.likedTraits,
      dislikedTraits: input.dislikedTraits,
    },
  ].slice(-20);
  const previousConfidence =
    typeof latestDna.traits.confidence === "number"
      ? latestDna.traits.confidence
      : 0.58;

  const [updatedDna] = await db
    .insert(tasteDna)
    .values({
      userId: input.userId,
      version: latestDna.version + 1,
      summary: latestDna.summary,
      generatedBy: "rating-update",
      traits: {
        ...latestDna.traits,
        ratingSignals,
        confidence: Math.min(0.98, previousConfidence + 0.02),
      },
    })
    .returning({ version: tasteDna.version });

  await db.insert(xpLog).values({
    userId: input.userId,
    itemId: input.itemId,
    action: "taste_dna_update",
    points: 0,
    metadata: { version: updatedDna.version },
  });

  return updatedDna.version;
}

function ratingToSentiment(rating: number) {
  if (rating === 5) return "loved" as const;
  if (rating === 4) return "liked" as const;
  if (rating === 3) return "mixed" as const;
  return "disliked" as const;
}
