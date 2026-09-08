/**
 * Reusable skeleton primitives for loading states.
 * All use Tailwind's `animate-pulse` with surface-container tokens.
 */

export function SkeletonLine({
  width = "w-full",
  height = "h-4",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-full bg-surface-container ${width} ${height}`}
    />
  );
}

export function SkeletonBlock({
  height = "h-40",
  className = "",
}: {
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-container ${height} ${className}`}
    />
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="flex flex-col gap-5 border-b border-outline-variant pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <SkeletonLine width="w-32" height="h-3" />
        <SkeletonLine width="w-64" height="h-9" />
        <SkeletonLine width="w-48" height="h-4" />
      </div>
      <SkeletonBlock height="h-10" className="w-32" />
    </div>
  );
}

export function SkeletonGrid({
  count = 6,
  cols = "md:grid-cols-2 xl:grid-cols-3",
  cardHeight = "h-40",
}: {
  count?: number;
  cols?: string;
  cardHeight?: string;
}) {
  return (
    <div className={`grid gap-4 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} height={cardHeight} />
      ))}
    </div>
  );
}
