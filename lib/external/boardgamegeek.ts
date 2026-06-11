import { XMLParser } from "fast-xml-parser";

import type { ExternalEnrichment } from "@/lib/external/types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

export async function getBoardGameGeekMetadata(
  title: string
): Promise<ExternalEnrichment | null> {
  const baseUrl =
    process.env.BOARDGAMEGEEK_API_BASE_URL ??
    "https://boardgamegeek.com/xmlapi2";
  const headers: HeadersInit = {
    Accept: "application/xml",
    "User-Agent": "Moodmatch/0.1",
  };
  if (process.env.BOARDGAMEGEEK_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.BOARDGAMEGEEK_API_TOKEN}`;
  }

  const searchResponse = await fetch(
    `${baseUrl}/search?query=${encodeURIComponent(title)}&type=boardgame&exact=1`,
    { headers, signal: AbortSignal.timeout(8000) }
  );
  if (!searchResponse.ok) return null;

  const search = parser.parse(await searchResponse.text()) as BggSearch;
  const result = asArray(search.items?.item)[0];
  if (!result?.id) return null;

  const detailsResponse = await fetch(`${baseUrl}/thing?id=${result.id}&stats=1`, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!detailsResponse.ok) return null;

  const details = parser.parse(await detailsResponse.text()) as BggDetails;
  const item = asArray(details.items?.item)[0];
  if (!item) return null;

  const names = asArray(item.name);
  const primaryName = names.find((name) => name.type === "primary")?.value;
  const links = asArray(item.link);

  return {
    description: decodeEntities(item.description),
    imageUrl: item.image,
    externalId: String(result.id),
    metadata: {
      provider: "boardgamegeek",
      providerId: String(result.id),
      rating: numberValue(item.statistics?.ratings?.average?.value),
      ratingLabel: "BoardGameGeek",
      ratingScale: 10,
      genres: links
        .filter((link) => link.type === "boardgamecategory")
        .map((link) => link.value)
        .slice(0, 8),
      creators: links
        .filter((link) => link.type === "boardgamedesigner")
        .map((link) => link.value)
        .slice(0, 6),
      playerCount: `${item.minplayers?.value ?? "?"}-${item.maxplayers?.value ?? "?"}`,
      playtimeMinutes: numberValue(item.playingtime?.value),
      complexity: numberValue(item.statistics?.ratings?.averageweight?.value),
      posterUrl: item.image,
      externalUrl: `https://boardgamegeek.com/boardgame/${result.id}`,
      primaryName,
    },
  };
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function numberValue(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : undefined;
}

function decodeEntities(value: string | undefined) {
  return value
    ?.replaceAll("&#10;", "\n")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

type BggSearch = {
  items?: { item?: { id?: string } | { id?: string }[] };
};

type BggValue = { value?: string };
type BggDetails = {
  items?: {
    item?: {
      name?: { type?: string; value: string } | { type?: string; value: string }[];
      description?: string;
      image?: string;
      minplayers?: BggValue;
      maxplayers?: BggValue;
      playingtime?: BggValue;
      link?: { type?: string; value: string } | { type?: string; value: string }[];
      statistics?: {
        ratings?: { average?: BggValue; averageweight?: BggValue };
      };
    };
  };
};
