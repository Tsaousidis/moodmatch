import {
  SkeletonBlock,
  SkeletonGrid,
  SkeletonLine,
  SkeletonPageHeader,
} from "@/components/layout/skeleton";

export default function DiscoverLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <SkeletonLine width="w-40" height="h-3" />
        <div className="mt-3 space-y-3">
          <SkeletonLine width="w-72" height="h-10" />
          <SkeletonLine width="w-56" height="h-4" />
        </div>
        {/* Filters row */}
        <div className="mt-8 flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-10" className="w-28" />
          ))}
        </div>
        {/* Results */}
        <div className="mt-6">
          <SkeletonBlock height="h-72 w-full" className="mb-6" />
          <SkeletonGrid count={6} />
        </div>
      </div>
    </main>
  );
}
