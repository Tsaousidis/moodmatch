import {
  SkeletonBlock,
  SkeletonGrid,
  SkeletonPageHeader,
} from "@/components/layout/skeleton";

export default function ExplainTasteLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SkeletonPageHeader />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <SkeletonBlock height="h-48" />
          <SkeletonBlock height="h-48" />
          <SkeletonBlock height="h-48" />
          <SkeletonBlock height="h-48" />
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <SkeletonBlock height="h-64" />
          <SkeletonBlock height="h-64" />
        </div>
      </div>
    </main>
  );
}
