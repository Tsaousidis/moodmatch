import {
  SkeletonBlock,
  SkeletonGrid,
  SkeletonLine,
  SkeletonPageHeader,
} from "@/components/layout/skeleton";

export default function TasteDnaLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Radar chart area */}
          <SkeletonBlock height="h-96" />
          <div className="grid gap-5">
            <SkeletonBlock height="h-40" />
            <SkeletonBlock height="h-48" />
          </div>
        </div>
        {/* Trait sections */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <SkeletonBlock height="h-48" />
          <SkeletonBlock height="h-48" />
          <SkeletonBlock height="h-48" />
        </div>
        {/* Rating signals */}
        <div className="mt-10 border-t border-outline-variant pt-8">
          <SkeletonLine width="w-56" height="h-8" />
          <div className="mt-5">
            <SkeletonGrid count={3} cardHeight="h-36" />
          </div>
        </div>
      </div>
    </main>
  );
}
