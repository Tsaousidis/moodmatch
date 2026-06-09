"use client";

import { useMemo, useState } from "react";

type WatchlistItem = {
  itemId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  releaseYear: number | null;
  type: string;
  categoryName: string | null;
  moodTags: string[] | null;
};

const moodOptions = ["Comforting", "Thoughtful", "Exciting", "Funny", "Social"];

export function WatchlistWorkspace({
  initialItems,
}: {
  initialItems: WatchlistItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const visibleItems = useMemo(
    () =>
      activeMood
        ? items.filter((item) => item.moodTags?.includes(activeMood))
        : items,
    [activeMood, items]
  );
  const chosenItem = items.find((item) => item.itemId === chosenId) ?? null;

  function chooseOne() {
    if (visibleItems.length === 0) return;
    const next =
      visibleItems[Math.floor(Math.random() * visibleItems.length)] ?? null;
    setChosenId(next?.itemId ?? null);
  }

  async function toggleMood(itemId: string, mood: string) {
    const item = items.find((entry) => entry.itemId === itemId);
    if (!item) return;

    const currentMoods = item.moodTags ?? [];
    const moodTags = currentMoods.includes(mood)
      ? currentMoods.filter((entry) => entry !== mood)
      : [...currentMoods, mood];
    setSavingId(itemId);

    const response = await fetch("/api/saved-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action: "update-moods", moodTags }),
    });

    if (response.ok) {
      setItems((current) =>
        current.map((entry) =>
          entry.itemId === itemId ? { ...entry, moodTags } : entry
        )
      );
    }
    setSavingId(null);
  }

  async function remove(itemId: string) {
    setSavingId(itemId);
    const response = await fetch("/api/saved-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });

    if (response.ok) {
      setItems((current) => current.filter((item) => item.itemId !== itemId));
      if (chosenId === itemId) setChosenId(null);
    }
    setSavingId(null);
  }

  return (
    <div>
      <section className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
            Mood Filters
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterButton
              label="All saved"
              active={activeMood === null}
              onClick={() => setActiveMood(null)}
            />
            {moodOptions.map((mood) => (
              <FilterButton
                key={mood}
                label={mood}
                active={activeMood === mood}
                onClick={() => setActiveMood(mood)}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={chooseOne}
          disabled={visibleItems.length === 0}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose one for me
        </button>
      </section>

      {chosenItem ? (
        <section className="mt-6 rounded-lg border border-[#c8d3cc] bg-[#1f2428] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9bc2bd]">
            Tonight&apos;s Pick
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{chosenItem.title}</h2>
          <p className="mt-3 text-sm text-[#cbd5d4]">
            {chosenItem.categoryName ?? chosenItem.type.replace("_", " ")}
            {chosenItem.releaseYear ? ` - ${chosenItem.releaseYear}` : ""}
          </p>
        </section>
      ) : null}

      {visibleItems.length > 0 ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <article
              key={item.itemId}
              className="flex min-h-64 flex-col rounded-lg border border-[#ded6c7] bg-white/80 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
                    {item.categoryName ?? item.type.replace("_", " ")}
                    {item.releaseYear ? ` - ${item.releaseYear}` : ""}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
                  {item.subtitle ? (
                    <p className="mt-1 text-sm text-[#657074]">{item.subtitle}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.itemId)}
                  disabled={savingId === item.itemId}
                  aria-label={`Remove ${item.title} from saved items`}
                  className="h-8 w-8 shrink-0 rounded-lg border border-[#cfc7b9] text-lg text-[#824a37] disabled:opacity-50"
                >
                  ×
                </button>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4f5f63]">
                {item.description ?? "Saved for the right mood."}
              </p>
              <div className="mt-auto pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#788486]">
                  Fits this mood
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {moodOptions.map((mood) => {
                    const selected = item.moodTags?.includes(mood) ?? false;
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => toggleMood(item.itemId, mood)}
                        disabled={savingId === item.itemId}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                          selected
                            ? "border-[#3c6e71] bg-[#e6eee9] text-[#315d60]"
                            : "border-[#d8d0c2] text-[#657074]"
                        } disabled:opacity-50`}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-[#cfc7b9] px-6 py-10 text-center text-[#657074]">
          {items.length === 0
            ? "Save recommendations to build your watchlist."
            : "No saved items match this mood yet."}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[#3c6e71] bg-[#3c6e71] text-white"
          : "border-[#cfc7b9] bg-white/70 text-[#344347]"
      }`}
    >
      {label}
    </button>
  );
}
