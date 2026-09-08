import {
  SkeletonBlock,
  SkeletonGrid,
  SkeletonLine,
  SkeletonPageHeader,
} from "@/components/layout/skeleton";

export default function RatingsLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        {/* Stats row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-24" />
          ))}
        </div>
        {/* By category */}
        <div className="mt-10">
          <SkeletonLine width="w-32" height="h-4" />
          <div className="mt-4">
            <SkeletonGrid count={6} cardHeight="h-24" />
          </div>
        </div>
        {/* History */}
        <div className="mt-10">
          <SkeletonLine width="w-24" height="h-4" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonBlock key={i} height="h-16" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
