import type { HomeRecommendation } from "@/lib/recommendations/home";
import { RatingControl } from "@/components/ratings/rating-control";
import { SaveButton } from "@/components/saved-items/save-button";
import { ExternalMetadataSummary } from "@/components/home/external-metadata";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: HomeRecommendation;
}) {
  return (
    <article className="grid min-h-52 grid-cols-[5rem_1fr] gap-4 rounded-lg border border-[#ded6c7] bg-white/80 p-4 shadow-sm">
      <div
        className="flex h-full min-h-44 items-end rounded-lg bg-[#315f63] bg-cover bg-center p-3 text-white"
        style={
          recommendation.imageUrl
            ? { backgroundImage: `linear-gradient(transparent, rgba(0,0,0,.78)), url("${recommendation.imageUrl}")` }
            : undefined
        }
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">
          {recommendation.categoryName}
        </span>
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
          {recommendation.type.replace("_", " ")}
          {recommendation.releaseYear
            ? ` - ${recommendation.releaseYear}`
            : ""}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-6 text-[#1f2428]">
          {recommendation.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#4f5f63]">
          {recommendation.reason}
        </p>
        <ExternalMetadataSummary metadata={recommendation.metadata ?? {}} />
        <div className="mt-auto flex gap-4 pt-4 text-xs font-semibold text-[#3c6e71]">
          <span>{recommendation.matchScore}% match</span>
          <span>{recommendation.confidenceScore}% confidence</span>
        </div>
        <div className="mt-3">
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
