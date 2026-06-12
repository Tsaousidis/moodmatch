"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy } from "lucide-react";

type QuestItem = {
  userQuestId: string;
  title: string;
  description: string | null;
  categoryName: string | null;
  targetCount: number;
  progress: number;
  xpReward: number;
  status: "available" | "active" | "completed" | "claimed" | "expired";
};

export function QuestList({ quests }: { quests: QuestItem[] }) {
  const router = useRouter();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  async function claim(userQuestId: string) {
    setClaimingId(userQuestId);
    setReward(null);

    const response = await fetch("/api/quests/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuestId }),
    });

    if (response.ok) {
      const body = (await response.json()) as { xpAwarded: number };
      setReward(body.xpAwarded);
      router.refresh();
    }

    setClaimingId(null);
  }

  return (
    <div>
      {reward ? (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-outline-variant bg-secondary-fixed p-4 text-sm font-semibold text-on-secondary-fixed">
          <Sparkles size={18} />
          Quest claimed. +{reward} XP added.
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {quests.map((quest) => {
          const progressPercent = Math.min(
            100,
            Math.round((quest.progress / quest.targetCount) * 100)
          );

          return (
            <article
              key={quest.userQuestId}
              className="editorial-shadow rounded-xl border border-outline-variant bg-surface-container-lowest p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                    <Trophy size={14} />
                    {quest.categoryName ?? "Taste Quest"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{quest.title}</h2>
                </div>
                <span className="rounded-lg bg-secondary-fixed px-3 py-1 text-xs font-semibold text-on-secondary-fixed">
                  +{quest.xpReward} XP
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4f5f63]">
                {quest.description}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full rounded-full bg-secondary-container"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-xs font-semibold text-[#4f5f63]">
                  {quest.progress} / {quest.targetCount}
                </p>
                {quest.status === "completed" ? (
                  <button
                    type="button"
                    onClick={() => void claim(quest.userQuestId)}
                    disabled={claimingId === quest.userQuestId}
                    className="h-9 rounded-lg bg-[#1f2428] px-4 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {claimingId === quest.userQuestId
                      ? "Claiming..."
                      : "Claim reward"}
                  </button>
                ) : (
                  <span className="text-xs font-semibold capitalize text-[#3c6e71]">
                    {quest.status}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
