import { SkeletonBlock, SkeletonGrid, SkeletonPageHeader } from "@/components/layout/skeleton";

export default function SavedLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-10" className="w-24" />
          ))}
        </div>
        <div className="mt-6">
          <SkeletonGrid count={6} cardHeight="h-40" />
        </div>
      </div>
    </main>
  );
}
