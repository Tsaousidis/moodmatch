"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";

export type OnboardingItemOption = {
  id: string;
  title: string;
  releaseYear: number | null;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string;
  type: string;
};

export function ItemSelector({
  items,
  selectedItemIds,
  apiPath,
  saveLabel,
  emptyError,
  nextPath,
  allowEmpty = false,
}: {
  items: OnboardingItemOption[];
  selectedItemIds: string[];
  apiPath: string;
  saveLabel: string;
  emptyError: string;
  nextPath?: string;
  allowEmpty?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(selectedItemIds);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const filteredItems = items.filter((item) =>
    `${item.title} ${item.categoryName}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const groupedItems = filteredItems.reduce<
    Record<string, OnboardingItemOption[]>
  >((groups, item) => {
    groups[item.categoryName] = [...(groups[item.categoryName] ?? []), item];
    return groups;
  }, {});

  function toggleItem(itemId: string) {
    setStatus("idle");
    setSelectedIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId]
    );
  }

  async function saveItems() {
    if (selectedIds.length === 0 && !allowEmpty) {
      setStatus("error");
      return;
    }

    setStatus("saving");

    const response = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemIds: selectedIds }),
    });

    if (response.ok) {
      setStatus("saved");

      if (nextPath) {
        router.push(nextPath);
        router.refresh();
      }

      return;
    }

    setStatus("error");
  }

  return (
    <div>
      <div className="max-w-xl">
        <label className="block">
          <span className="text-sm font-medium text-[#354247]">
            Search suggestions
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies, books, games..."
            className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>
      </div>

      <div className="mt-8 space-y-8">
        {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
          <section key={categoryName}>
            <h2 className="text-xl font-semibold text-[#1f2428]">
              {categoryName}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {categoryItems.map((item) => {
                const isSelected = selectedSet.has(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`group flex min-h-32 flex-col justify-between rounded-lg border bg-white/80 p-4 text-left shadow-sm transition ${
                      isSelected
                        ? "border-[#3c6e71] bg-[#f4fbf7] ring-2 ring-[#3c6e71]/25"
                        : "border-[#ded6c7] hover:border-[#bfc9c2] hover:bg-[#fbfaf7]"
                    }`}
                  >
                    <span>
                      <span className="block text-base font-semibold leading-snug text-[#1f2428]">
                        {item.title}
                      </span>
                      <span className="mt-3 inline-flex items-center rounded-full border border-[#ded6c7] bg-[#f7f3eb] px-2.5 py-1 text-xs font-semibold capitalize text-[#4f5f63]">
                        {item.releaseYear
                          ? `${item.type.replace("_", " ")} · ${item.releaseYear}`
                          : item.type.replace("_", " ")}
                      </span>
                    </span>
                    <span
                      className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? "bg-[#3c6e71] text-white"
                          : "bg-[#1f2428] text-white group-hover:bg-[#3c6e71]"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {isSelected ? "Added" : "Add to taste"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={saveItems}
          disabled={(!allowEmpty && selectedIds.length === 0) || status === "saving"}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : saveLabel}
        </button>
        <p className="text-sm text-[#4f5f63]">
          {status === "saved"
            ? "Saved."
            : status === "error"
              ? emptyError
              : `${selectedIds.length} selected`}
        </p>
      </div>
    </div>
  );
}
