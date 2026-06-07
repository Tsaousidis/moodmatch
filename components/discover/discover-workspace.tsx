"use client";

import { FormEvent, useState } from "react";

import { PerfectMatchCard } from "@/components/home/perfect-match-card";
import { RecommendationCard } from "@/components/home/recommendation-card";
import type { HomeRecommendation } from "@/lib/recommendations/home";

type DiscoverCategory = {
  id: string;
  name: string;
  slug: string;
};

type DiscoverResults = {
  perfectMatch: HomeRecommendation | null;
  recommendations: HomeRecommendation[];
};

const sliderFields = [
  ["novelty", "Novelty"],
  ["comfort", "Comfort"],
  ["energy", "Energy"],
] as const;

export function DiscoverWorkspace({
  categories,
  initialResults,
}: {
  categories: DiscoverCategory[];
  initialResults: DiscoverResults;
}) {
  const [results, setResults] = useState(initialResults);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function discover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/discover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vibe: String(formData.get("vibe") ?? ""),
        categoryId: String(formData.get("categoryId") ?? "") || null,
        novelty: Number(formData.get("novelty") ?? 50),
        comfort: Number(formData.get("comfort") ?? 50),
        energy: Number(formData.get("energy") ?? 50),
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setResults((await response.json()) as DiscoverResults);
    setStatus("idle");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <form
        onSubmit={discover}
        className="h-fit rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm"
      >
        <label className="block">
          <span className="text-sm font-semibold text-[#1f2428]">
            Vibe search
          </span>
          <textarea
            name="vibe"
            rows={4}
            placeholder="Something clever, warm, and easy to get into..."
            className="mt-2 w-full resize-none rounded-lg border border-[#cfc7b9] bg-white p-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-[#1f2428]">Category</span>
          <select
            name="categoryId"
            className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none"
          >
            <option value="">All selected categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 space-y-4">
          {sliderFields.map(([field, label]) => (
            <label key={field} className="block">
              <span className="text-sm font-semibold text-[#1f2428]">
                {label}
              </span>
              <input
                name={field}
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="mt-2 w-full accent-[#3c6e71]"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 h-11 w-full rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Matching..." : "Find my match"}
        </button>

        {status === "error" ? (
          <p className="mt-3 text-sm text-[#7a2e1f]">
            Could not load recommendations.
          </p>
        ) : null}
      </form>

      <div className="min-w-0">
        {results.perfectMatch ? (
          <PerfectMatchCard recommendation={results.perfectMatch} />
        ) : (
          <p className="rounded-lg border border-[#ded6c7] bg-white/80 p-6 text-[#4f5f63]">
            No recommendations available for these filters yet.
          </p>
        )}

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#1f2428]">
            More recommendations
          </h2>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {results.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
