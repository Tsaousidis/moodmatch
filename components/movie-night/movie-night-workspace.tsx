"use client";

import { FormEvent, useState } from "react";

import { PerfectMatchCard } from "@/components/home/perfect-match-card";
import { RecommendationCard } from "@/components/home/recommendation-card";
import type { GroupProfile } from "@/lib/ai/group-profile";
import type { HomeRecommendation } from "@/lib/recommendations/home";

type MovieNightResults = {
  profile: GroupProfile;
  perfectPick: HomeRecommendation | null;
  safePicks: HomeRecommendation[];
  compromisePicks: HomeRecommendation[];
  wildcard: HomeRecommendation | null;
};

const vibes = ["Balanced", "Easygoing", "Funny", "Intense", "Adventurous"];

export function MovieNightWorkspace() {
  const [results, setResults] = useState<MovieNightResults | null>(null);
  const [vibe, setVibe] = useState("Balanced");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function planMovieNight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/movie-night", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tastes: String(formData.get("tastes") ?? ""),
        alreadySeen: String(formData.get("alreadySeen") ?? ""),
        groupSize: Number(formData.get("groupSize") ?? 2),
        vibe,
      }),
    });
    const body = (await response.json()) as MovieNightResults & {
      error?: string;
    };

    if (!response.ok) {
      setError(body.error ?? "Could not plan movie night.");
      setStatus("error");
      return;
    }

    setResults(body);
    setStatus("idle");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <form
        onSubmit={planMovieNight}
        className="h-fit rounded-lg border border-[#ded6c7] bg-white/80 p-5"
      >
        <label className="block">
          <span className="text-sm font-semibold">Describe the group</span>
          <textarea
            name="tastes"
            required
            minLength={10}
            maxLength={1200}
            rows={6}
            placeholder="Two people love clever sci-fi, one prefers warm comedies, nobody wants horror..."
            className="mt-2 w-full resize-none rounded-lg border border-[#cfc7b9] bg-white p-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold">Already seen</span>
          <textarea
            name="alreadySeen"
            maxLength={1200}
            rows={4}
            placeholder="Arrival, Parasite, Mad Max..."
            className="mt-2 w-full resize-none rounded-lg border border-[#cfc7b9] bg-white p-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold">Group size</span>
          <input
            name="groupSize"
            type="number"
            min="2"
            max="20"
            defaultValue="3"
            className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none focus:border-[#3c6e71]"
          />
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Tonight&apos;s vibe</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {vibes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setVibe(option)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  vibe === option
                    ? "border-[#3c6e71] bg-[#3c6e71] text-white"
                    : "border-[#cfc7b9] bg-white text-[#344347]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 h-11 w-full rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Finding common ground..." : "Plan movie night"}
        </button>
        {status === "error" ? (
          <p className="mt-3 text-sm text-[#7a2e1f]">{error}</p>
        ) : null}
      </form>

      <div className="min-w-0">
        {results ? (
          <>
            <GroupProfileSummary profile={results.profile} />
            <section className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
                Perfect Group Pick
              </p>
              <div className="mt-3">
                {results.perfectPick ? (
                  <PerfectMatchCard recommendation={results.perfectPick} />
                ) : null}
              </div>
            </section>
            <PickSection title="Safe Picks" picks={results.safePicks} />
            <PickSection
              title="Compromise Picks"
              picks={results.compromisePicks}
            />
            {results.wildcard ? (
              <PickSection title="Wildcard" picks={[results.wildcard]} />
            ) : null}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-[#cfc7b9] px-6 py-16 text-center">
            <p className="text-lg font-semibold">One group, several tastes.</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#657074]">
              Describe who is watching and what tonight should feel like.
              Moodmatch will look for common ground without flattening the
              differences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupProfileSummary({ profile }: { profile: GroupProfile }) {
  return (
    <section className="rounded-lg border border-[#ded6c7] bg-[#e6eee9] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#315d60]">
            Group Taste Profile
          </p>
          <p className="mt-2 max-w-3xl leading-7 text-[#344347]">
            {profile.summary}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#657074]">
          {profile.source === "azure-ai" ? "Azure AI" : "Moodmatch analysis"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {profile.sharedPriorities.map((priority) => (
          <span
            key={priority}
            className="rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold text-[#315d60]"
          >
            {priority}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#4f5f63]">{profile.strategy}</p>
    </section>
  );
}

function PickSection({
  title,
  picks,
}: {
  title: string;
  picks: HomeRecommendation[];
}) {
  if (picks.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {picks.map((pick) => (
          <RecommendationCard key={`${title}-${pick.id}`} recommendation={pick} />
        ))}
      </div>
    </section>
  );
}
