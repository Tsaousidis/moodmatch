export default function TodayLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="flex flex-col gap-5 border-b border-outline-variant pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-32 animate-pulse rounded-full bg-surface-container" />
            <div className="h-10 w-72 animate-pulse rounded-xl bg-surface-container" />
            <div className="h-4 w-56 animate-pulse rounded-full bg-surface-container" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-20 animate-pulse rounded-lg bg-surface-container"
              />
            ))}
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="mt-6 h-10 w-full max-w-md animate-pulse rounded-xl bg-surface-container" />

        {/* Perfect match card skeleton */}
        <div className="mt-8 h-64 w-full animate-pulse rounded-xl bg-surface-container" />

        {/* More picks section */}
        <div className="mt-10">
          <div className="mb-5 h-8 w-48 animate-pulse rounded-xl bg-surface-container" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-surface-container"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
