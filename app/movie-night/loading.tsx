import { SkeletonBlock, SkeletonPageHeader } from "@/components/layout/skeleton";

export default function MovieNightLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <SkeletonPageHeader />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <SkeletonBlock height="h-80" />
          <SkeletonBlock height="h-80" />
        </div>
      </div>
    </main>
  );
}
