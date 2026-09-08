import { SkeletonBlock, SkeletonPageHeader } from "@/components/layout/skeleton";

export default function QuestsLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        <div className="mt-6 max-w-xl">
          <SkeletonBlock height="h-10" />
        </div>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} height="h-24" />
          ))}
        </div>
      </div>
    </main>
  );
}
