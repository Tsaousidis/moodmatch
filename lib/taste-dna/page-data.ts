import { getLatestTasteDna } from "@/lib/onboarding/taste-dna";

export type TasteDnaAffinity = {
  label: string;
  value: number;
};

export type TasteDnaRatingSignal = {
  title: string;
  rating: number;
  likedTraits: string[];
  dislikedTraits: string[];
};

export async function getTasteDnaPageData(userId: string) {
  const dna = await getLatestTasteDna(userId);

  if (!dna) {
    return null;
  }

  const affinities = Object.entries(
    isRecord(dna.traits.categoryAffinities)
      ? dna.traits.categoryAffinities
      : {}
  )
    .map(([label, value]) => ({
      label,
      value: clampNumber(value, 0, 100),
    }))
    .sort((first, second) => second.value - first.value);

  const ratingSignals = Array.isArray(dna.traits.ratingSignals)
    ? dna.traits.ratingSignals
        .filter(isRecord)
        .map(normalizeRatingSignal)
        .filter((signal): signal is TasteDnaRatingSignal => signal !== null)
        .reverse()
        .slice(0, 6)
    : [];

  return {
    version: dna.version,
    summary: dna.summary ?? "Your Taste DNA is ready to guide better picks.",
    generatedBy: dna.generatedBy ?? "Moodmatch",
    updatedAt: dna.createdAt,
    confidence: clampNumber(dna.traits.confidence, 0, 1),
    recommendationStyle: stringValue(
      dna.traits.recommendationStyle,
      "Balanced between reliable favorites and fresh discoveries"
    ),
    affinities,
    anchors: stringArray(dna.traits.anchors),
    moodKeywords: stringArray(dna.traits.moodKeywords),
    avoidances: stringArray(dna.traits.avoidances),
    ratingSignals,
  };
}

function normalizeRatingSignal(
  signal: Record<string, unknown>
): TasteDnaRatingSignal | null {
  if (typeof signal.title !== "string" || typeof signal.rating !== "number") {
    return null;
  }

  return {
    title: signal.title,
    rating: clampNumber(signal.rating, 1, 5),
    likedTraits: stringArray(signal.likedTraits),
    dislikedTraits: stringArray(signal.dislikedTraits),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function clampNumber(value: unknown, minimum: number, maximum: number) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number)
    ? Math.min(maximum, Math.max(minimum, number))
    : minimum;
}
