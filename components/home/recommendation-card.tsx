import { Sparkles } from "lucide-react";

import { ExternalMetadataSummary } from "@/components/home/external-metadata";
import { RatingControl } from "@/components/ratings/rating-control";
import { SaveButton } from "@/components/saved-items/save-button";
import type { HomeRecommendation } from "@/lib/recommendations/home";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: HomeRecommendation;
}) {
  return (
    <article className="editorial-shadow grid min-h-64 grid-cols-[6.5rem_1fr] gap-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <div
        className="flex h-full min-h-52 items-end overflow-hidden rounded-lg bg-primary-container bg-cover bg-center p-3 text-white"
        style={
          recommendation.imageUrl
            ? {
                backgroundImage: `linear-gradient(transparent, rgba(20,37,39,.88)), url("${recommendation.imageUrl}")`,
              }
            : undefined
        }
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
          {recommendation.categoryName}
        </span>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
              {recommendation.type.replace("_", " ")}
              {recommendation.releaseYear
                ? ` / ${recommendation.releaseYear}`
                : ""}
            </p>
            <h3 className="mt-2 text-xl font-semibold leading-6 text-primary">
              {recommendation.title}
            </h3>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary-fixed px-2 py-1 text-xs font-bold text-on-secondary-fixed">
            <Sparkles size={12} />
            {recommendation.matchScore}%
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-on-surface-variant">
          {recommendation.reason}
        </p>
        <ExternalMetadataSummary metadata={recommendation.metadata ?? {}} />

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-xs font-semibold text-on-surface-variant">
            {recommendation.confidenceScore}% confidence
          </span>
          <SaveButton
            itemId={recommendation.id}
            initialSaved={recommendation.isSaved}
          />
        </div>
        <RatingControl itemId={recommendation.id} />
      </div>
    </article>
  );
}
