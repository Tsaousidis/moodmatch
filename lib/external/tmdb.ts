import type { ExternalEnrichment } from "@/lib/external/types";

const tmdbBaseUrl = "https://api.themoviedb.org/3";

export async function getTmdbMetadata(
  title: string,
  type: "movie" | "tv_show",
  releaseYear: number | null
): Promise<ExternalEnrichment | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const mediaType = type === "movie" ? "movie" : "tv";
  const searchParams = new URLSearchParams({
    api_key: apiKey,
    query: title,
    include_adult: "false",
  });
  if (releaseYear) {
    searchParams.set(type === "movie" ? "year" : "first_air_date_year", String(releaseYear));
  }

  const search = await fetchJson<TmdbSearchResponse>(
    `${tmdbBaseUrl}/search/${mediaType}?${searchParams}`
  );
  const match = search?.results?.[0];
  if (!match) return null;

  const details = await fetchJson<TmdbDetails>(
    `${tmdbBaseUrl}/${mediaType}/${match.id}?api_key=${apiKey}&append_to_response=videos,watch/providers`
  );
  if (!details) return null;

  const trailer = details.videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const usProviders = details["watch/providers"]?.results?.US;
  const availability = [
    ...(usProviders?.flatrate ?? []),
    ...(usProviders?.rent ?? []),
    ...(usProviders?.buy ?? []),
  ].map((provider) => provider.provider_name);

  return {
    description: details.overview || undefined,
    imageUrl: details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : undefined,
    externalId: String(details.id),
    metadata: {
      provider: "tmdb",
      providerId: String(details.id),
      rating: round(details.vote_average),
      ratingLabel: "TMDB",
      ratingScale: 10,
      genres: details.genres?.map((genre) => genre.name) ?? [],
      runtimeMinutes:
        details.runtime ?? details.episode_run_time?.[0] ?? undefined,
      posterUrl: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : undefined,
      trailerUrl: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : undefined,
      availability: [...new Set(availability)].slice(0, 6),
      externalUrl:
        usProviders?.link ??
        `https://www.themoviedb.org/${mediaType}/${details.id}`,
    },
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  return response.ok ? ((await response.json()) as T) : null;
}

function round(value: number | undefined) {
  return typeof value === "number" ? Math.round(value * 10) / 10 : undefined;
}

type TmdbSearchResponse = {
  results?: { id: number }[];
};

type TmdbDetails = {
  id: number;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
  runtime?: number | null;
  episode_run_time?: number[];
  genres?: { name: string }[];
  videos?: {
    results?: { site: string; type: string; key: string }[];
  };
  "watch/providers"?: {
    results?: {
      US?: {
        link?: string;
        flatrate?: { provider_name: string }[];
        rent?: { provider_name: string }[];
        buy?: { provider_name: string }[];
      };
    };
  };
};
