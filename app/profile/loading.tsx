import { SkeletonBlock, SkeletonPageHeader } from "@/components/layout/skeleton";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        <div className="mt-6 max-w-xl">
          <SkeletonBlock height="h-10" />
        </div>
        {/* Section tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-10" className="w-28" />
          ))}
        </div>
        <div className="mt-8 space-y-6 border-b border-outline-variant pb-10">
          <SkeletonBlock height="h-5 w-40" />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonBlock key={i} height="h-14" />
            ))}
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-12" />
          ))}
        </div>
      </div>
    </main>
  );
}
