"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const positiveTraits = ["Story", "Characters", "Atmosphere", "Pacing"];
const negativeTraits = ["Too slow", "Too intense", "Predictable", "Not my mood"];

export function RatingControl({
  itemId,
  variant = "light",
}: {
  itemId: string;
  variant?: "light" | "dark";
}) {
  const [rating, setRating] = useState(0);
  const [likedTraits, setLikedTraits] = useState<string[]>([]);
  const [dislikedTraits, setDislikedTraits] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const isDark = variant === "dark";

  function toggleTrait(
    trait: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setStatus("idle");
    setter((current) =>
      current.includes(trait)
        ? current.filter((item) => item !== trait)
        : [...current, trait]
    );
  }

  async function submitRating(nextRating = rating) {
    if (!nextRating) return;
    setStatus("saving");

    const response = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        rating: nextRating,
        likedTraits,
        dislikedTraits,
      }),
    });

    setStatus(response.ok ? "saved" : "error");
  }

  return (
    <div className="mt-4 border-t border-current/15 pt-4">
      <div className="flex flex-wrap items-center gap-1">
        <span
          className={`mr-2 text-xs font-semibold ${
            isDark ? "text-[#cbd7d2]" : "text-[#4f5f63]"
          }`}
        >
          Rate
        </span>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} stars`}
            onClick={() => {
              setRating(value);
              void submitRating(value);
            }}
            className={`flex h-8 w-8 items-center justify-center transition ${
              value <= rating
                ? "text-[#d69e2e]"
                : isDark
                  ? "text-white/35 hover:text-white/70"
                  : "text-[#cfc7b9] hover:text-[#9d8f77]"
            }`}
          >
            <Star
              size={18}
              fill={value <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      {rating > 0 ? (
        <div className="mt-3">
          <p
            className={`text-xs font-semibold ${
              isDark ? "text-[#cbd7d2]" : "text-[#4f5f63]"
            }`}
          >
            Quick feedback
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(rating >= 4 ? positiveTraits : negativeTraits).map((trait) => {
              const list = rating >= 4 ? likedTraits : dislikedTraits;
              const setter =
                rating >= 4 ? setLikedTraits : setDislikedTraits;
              const selected = list.includes(trait);

              return (
                <button
                  key={trait}
                  type="button"
                  onClick={() => toggleTrait(trait, setter)}
                  className={`rounded-lg border px-2 py-1 text-xs font-medium transition ${
                    selected
                      ? isDark
                        ? "border-white bg-white text-[#1f2428]"
                        : "border-[#3c6e71] bg-[#3c6e71] text-white"
                      : isDark
                        ? "border-white/30 text-white"
                        : "border-[#cfc7b9] bg-white text-[#4f5f63]"
                  }`}
                >
                  {trait}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => void submitRating()}
              disabled={status === "saving"}
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                isDark
                  ? "bg-white text-[#1f2428]"
                  : "bg-[#1f2428] text-white"
              } disabled:opacity-60`}
            >
              {status === "saving" ? "Saving..." : "Save feedback"}
            </button>
          </div>
        </div>
      ) : null}

      {status === "saved" ? (
        <p className={`mt-2 text-xs ${isDark ? "text-[#a9c6bd]" : "text-[#3c6e71]"}`}>
          Saved. +10 XP on first rating. Taste DNA updated.
        </p>
      ) : status === "error" ? (
        <p className="mt-2 text-xs text-[#b04a38]">Could not save rating.</p>
      ) : null}
    </div>
  );
}
