import type { HomeRecommendation } from "@/lib/recommendations/home";
import { RatingControl } from "@/components/ratings/rating-control";

export function PerfectMatchCard({
  recommendation,
}: {
  recommendation: HomeRecommendation;
}) {
  return (
    <section className="grid overflow-hidden rounded-lg border border-[#c8d3cc] bg-[#1f2428] text-white shadow-sm lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9c6bd]">
          Perfect Match of the Day
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          {recommendation.title}
        </h2>
        <p className="mt-3 text-sm font-medium text-[#cbd7d2]">
          {recommendation.categoryName}
          {recommendation.releaseYear
            ? ` - ${recommendation.releaseYear}`
            : ""}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#dce4e0]">
          {recommendation.reason}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#1f2428]">
            {recommendation.matchScore}% Match Score
          </span>
          <span className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold">
            {recommendation.confidenceScore}% Confidence
          </span>
        </div>
        <RatingControl itemId={recommendation.id} variant="dark" />
      </div>
      <div className="flex min-h-56 items-end bg-[#3c6e71] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#cce0d9]">
            Today&apos;s lane
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {recommendation.categoryName}
          </p>
        </div>
      </div>
    </section>
  );
}
