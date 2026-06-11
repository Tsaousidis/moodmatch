export type ExternalMetadata = {
  provider: "tmdb" | "google-books" | "boardgamegeek";
  providerId: string;
  rating?: number;
  ratingLabel?: string;
  ratingScale?: number;
  genres?: string[];
  runtimeMinutes?: number;
  pageCount?: number;
  playerCount?: string;
  playtimeMinutes?: number;
  complexity?: number;
  creators?: string[];
  posterUrl?: string;
  trailerUrl?: string;
  availability?: string[];
  externalUrl?: string;
};

export type ExternalEnrichment = {
  description?: string;
  imageUrl?: string;
  externalId?: string;
  metadata: ExternalMetadata & Record<string, unknown>;
};
