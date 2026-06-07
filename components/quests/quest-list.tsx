"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="mb-5 rounded-lg border border-[#9ab7aa] bg-[#eaf0eb] p-4 text-sm font-semibold text-[#315f63]">
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
              className="rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
                    {quest.categoryName ?? "Taste Quest"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{quest.title}</h2>
                </div>
                <span className="rounded-lg bg-[#eaf0eb] px-3 py-1 text-xs font-semibold text-[#315f63]">
                  +{quest.xpReward} XP
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4f5f63]">
                {quest.description}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ece6dc]">
                <div
                  className="h-full rounded-full bg-[#3c6e71]"
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
