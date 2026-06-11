import type { ExternalMetadata } from "@/lib/external/types";

export function ExternalMetadataSummary({
  metadata,
  variant = "light",
}: {
  metadata: Record<string, unknown>;
  variant?: "light" | "dark";
}) {
  const details = metadata as Partial<ExternalMetadata>;
  const highlights = [
    details.rating && details.ratingLabel
      ? `${details.rating}/${details.ratingScale ?? 10} ${details.ratingLabel}`
      : null,
    details.runtimeMinutes ? `${details.runtimeMinutes} min` : null,
    details.pageCount ? `${details.pageCount} pages` : null,
    details.playerCount ? `${details.playerCount} players` : null,
    details.playtimeMinutes ? `${details.playtimeMinutes} min playtime` : null,
    details.complexity ? `${details.complexity}/5 complexity` : null,
  ].filter((value): value is string => Boolean(value));
  const muted = variant === "dark" ? "text-[#cbd7d2]" : "text-[#4f5f63]";

  if (highlights.length === 0 && !details.externalUrl && !details.trailerUrl) {
    return null;
  }

  return (
    <div className={`mt-4 text-xs ${muted}`}>
      {highlights.length > 0 ? (
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-semibold">
          {highlights.slice(0, 4).map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      ) : null}
      {details.availability?.length ? (
        <p className="mt-2">
          Available on {details.availability.slice(0, 3).join(", ")}
        </p>
      ) : null}
      <div className="mt-2 flex gap-3 font-semibold">
        {details.externalUrl ? (
          <a
            href={details.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            Where to watch, read, or play
          </a>
        ) : null}
        {details.trailerUrl ? (
          <a
            href={details.trailerUrl}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            Trailer
          </a>
        ) : null}
      </div>
    </div>
  );
}
