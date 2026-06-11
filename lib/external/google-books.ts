import type { ExternalEnrichment } from "@/lib/external/types";

export async function getGoogleBooksMetadata(
  title: string
): Promise<ExternalEnrichment | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    q: `intitle:${title}`,
    key: apiKey,
    maxResults: "5",
    printType: "books",
  });
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;

  const body = (await response.json()) as GoogleBooksResponse;
  const match =
    body.items?.find(
      (item) => item.volumeInfo.title.toLowerCase() === title.toLowerCase()
    ) ?? body.items?.[0];
  if (!match) return null;

  const info = match.volumeInfo;
  const imageUrl = info.imageLinks?.thumbnail?.replace("http://", "https://");

  return {
    description: info.description,
    imageUrl,
    externalId: match.id,
    metadata: {
      provider: "google-books",
      providerId: match.id,
      rating: info.averageRating,
      ratingLabel: "Google Books",
      ratingScale: 5,
      genres: info.categories ?? [],
      pageCount: info.pageCount,
      creators: info.authors ?? [],
      posterUrl: imageUrl,
      externalUrl: info.infoLink,
    },
  };
}

type GoogleBooksResponse = {
  items?: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      pageCount?: number;
      categories?: string[];
      averageRating?: number;
      infoLink?: string;
      imageLinks?: { thumbnail?: string };
    };
  }[];
};
