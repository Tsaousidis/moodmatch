"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TasteTagOption = {
  id: string;
  label: string;
  confidence: string | null;
  isConfirmed: boolean;
  isRejected: boolean;
  categoryName: string | null;
};

type TagDecision = "pending" | "confirmed" | "rejected";

export function TagsConfirmation({ tags }: { tags: TasteTagOption[] }) {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, TagDecision>>(() =>
    Object.fromEntries(
      tags.map((tag) => [
        tag.id,
        tag.isConfirmed ? "confirmed" : tag.isRejected ? "rejected" : "pending",
      ])
    )
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  function setDecision(tagId: string, decision: TagDecision) {
    setStatus("idle");
    setDecisions((current) => ({ ...current, [tagId]: decision }));
  }

  async function saveTags() {
    setStatus("saving");

    const response = await fetch("/api/onboarding/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisions: Object.entries(decisions).map(([tagId, decision]) => ({
          tagId,
          decision,
        })),
      }),
    });

    if (response.ok) {
      setStatus("saved");
      router.push("/onboarding/comfort");
      router.refresh();
      return;
    }

    setStatus("error");
  }

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tags.map((tag) => {
          const decision = decisions[tag.id] ?? "pending";

          return (
            <div
              key={tag.id}
              className="rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f7d72]">
                {tag.categoryName ?? "General"}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-[#1f2428]">
                {tag.label}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDecision(tag.id, "confirmed")}
                  className={`h-10 rounded-lg border text-sm font-semibold transition ${
                    decision === "confirmed"
                      ? "border-[#3c6e71] bg-[#3c6e71] text-white"
                      : "border-[#cfc7b9] bg-white text-[#1f2428]"
                  }`}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setDecision(tag.id, "rejected")}
                  className={`h-10 rounded-lg border text-sm font-semibold transition ${
                    decision === "rejected"
                      ? "border-[#7a2e1f] bg-[#7a2e1f] text-white"
                      : "border-[#cfc7b9] bg-white text-[#1f2428]"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={saveTags}
          disabled={status === "saving"}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save taste tags"}
        </button>
        <p className="text-sm text-[#4f5f63]">
          {status === "saved"
            ? "Saved."
            : status === "error"
              ? "Could not save taste tags."
              : `${tags.length} tags`}
        </p>
      </div>
    </div>
  );
}
