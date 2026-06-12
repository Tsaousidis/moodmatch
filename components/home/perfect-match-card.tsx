import { ArrowUpRight, Sparkles } from "lucide-react";

import { ExternalMetadataSummary } from "@/components/home/external-metadata";
import { RatingControl } from "@/components/ratings/rating-control";
import { SaveButton } from "@/components/saved-items/save-button";
import type { HomeRecommendation } from "@/lib/recommendations/home";

export function PerfectMatchCard({
  recommendation,
}: {
  recommendation: HomeRecommendation;
}) {
  return (
    <section className="editorial-shadow grid overflow-hidden rounded-xl border border-primary-container bg-primary text-on-primary lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary-fixed">
            <Sparkles size={15} />
            Perfect Match of the Day
          </p>
          <span className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-on-primary-container">
            {recommendation.confidenceScore}% confidence
          </span>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-on-primary-container">
            {recommendation.categoryName}
            {recommendation.releaseYear
              ? ` / ${recommendation.releaseYear}`
              : ""}
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {recommendation.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-on-primary-container">
            {recommendation.description ?? recommendation.reason}
          </p>
        </div>

        <ExternalMetadataSummary
          metadata={recommendation.metadata ?? {}}
          variant="dark"
        />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[7px] border-secondary-container bg-primary-container">
            <span className="font-display text-2xl font-semibold text-white">
              {recommendation.matchScore}%
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-container">
              Vibe Match
            </p>
            <p className="mt-1 max-w-sm text-sm text-on-primary-container">
              {recommendation.reason}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <SaveButton
            itemId={recommendation.id}
            initialSaved={recommendation.isSaved}
            variant="dark"
          />
          <span className="flex items-center gap-1 text-xs font-semibold text-on-primary-container">
            Explore match <ArrowUpRight size={14} />
          </span>
        </div>
        <RatingControl itemId={recommendation.id} variant="dark" />
      </div>

      <div
        className="relative min-h-72 bg-primary-container bg-cover bg-center lg:min-h-full"
        style={
          recommendation.imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(20,37,39,.88)), url("${recommendation.imageUrl}")`,
              }
            : undefined
        }
      >
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tertiary-fixed">
            Today&apos;s lane
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-white">
            {recommendation.categoryName}
          </p>
        </div>
      </div>
    </section>
  );
}
