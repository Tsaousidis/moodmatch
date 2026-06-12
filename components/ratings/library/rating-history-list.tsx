type RatingHistoryEntry = {
  id: string;
  title: string;
  type: string;
  releaseYear: number | null;
  categoryName: string | null;
  rating: number | null;
  sentiment: string | null;
  likedTraits: string[] | null;
  dislikedTraits: string[] | null;
  updatedAt: Date;
};

export function RatingHistoryList({
  history,
}: {
  history: RatingHistoryEntry[];
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-on-surface-variant">
        Your ratings will appear here after you rate a recommendation.
      </div>
    );
  }

  return (
    <div className="editorial-shadow divide-y divide-outline-variant overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      {history.map((entry) => {
        const traits = [
          ...(entry.likedTraits ?? []),
          ...(entry.dislikedTraits ?? []),
        ];

        return (
          <article
            key={entry.id}
            className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_8rem_10rem] md:items-center"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                {entry.categoryName ?? entry.type.replace("_", " ")}
                {entry.releaseYear ? ` - ${entry.releaseYear}` : ""}
              </p>
              <h3 className="mt-2 truncate text-xl font-semibold text-primary">
                {entry.title}
              </h3>
              {traits.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {traits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-lg bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
                Rating
              </p>
              <p className="mt-2 text-lg font-semibold text-[#d69e2e]">
                {entry.rating
                  ? `${"★".repeat(entry.rating)}${"☆".repeat(5 - entry.rating)}`
                  : "Not scored"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
                Updated
              </p>
              <p className="mt-2 text-sm font-medium text-[#4f5f63]">
                {entry.updatedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {entry.sentiment ? (
                <p className="mt-1 text-xs capitalize text-[#3c6e71]">
                  {entry.sentiment}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
