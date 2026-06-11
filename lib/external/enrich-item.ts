import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { getBoardGameGeekMetadata } from "@/lib/external/boardgamegeek";
import { getGoogleBooksMetadata } from "@/lib/external/google-books";
import { getTmdbMetadata } from "@/lib/external/tmdb";
import type { ExternalEnrichment } from "@/lib/external/types";

type EnrichableItem = {
  id: string;
  title: string;
  type: string;
  releaseYear: number | null;
  metadata: Record<string, unknown> | null;
};

export async function enrichItems(catalog: EnrichableItem[]) {
  for (const item of catalog) {
    const canRetryBoardGameGeek =
      item.type === "board_game" &&
      item.metadata?.enrichmentStatus === "unavailable" &&
      Boolean(process.env.BOARDGAMEGEEK_API_TOKEN);
    if (item.metadata?.enrichmentAttemptedAt && !canRetryBoardGameGeek) continue;

    const enrichment = await getEnrichment(item);
    const attemptedAt = new Date().toISOString();

    await db
      .update(items)
      .set(
        enrichment
          ? {
              description: enrichment.description,
              imageUrl: enrichment.imageUrl,
              externalId: enrichment.externalId,
              metadata: {
                ...enrichment.metadata,
                enrichmentAttemptedAt: attemptedAt,
              },
              updatedAt: new Date(),
            }
          : {
              metadata: {
                ...(item.metadata ?? {}),
                enrichmentAttemptedAt: attemptedAt,
                enrichmentStatus: "unavailable",
              },
              updatedAt: new Date(),
            }
      )
      .where(eq(items.id, item.id));
  }
}

async function getEnrichment(item: EnrichableItem): Promise<ExternalEnrichment | null> {
  try {
    if (item.type === "movie" || item.type === "tv_show") {
      return await getTmdbMetadata(item.title, item.type, item.releaseYear);
    }
    if (item.type === "book") {
      return await getGoogleBooksMetadata(item.title);
    }
    if (item.type === "board_game") {
      return await getBoardGameGeekMetadata(item.title);
    }
    return null;
  } catch {
    return null;
  }
}
