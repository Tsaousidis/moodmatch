"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  itemType: string;
  description: string | null;
};

export function CategorySelector({
  categories,
  selectedCategoryIds,
}: {
  categories: CategoryOption[];
  selectedCategoryIds: string[];
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState(selectedCategoryIds);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const selectedCount = selectedIds.length;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  function toggleCategory(categoryId: string) {
    setStatus("idle");
    setSelectedIds((currentIds) =>
      currentIds.includes(categoryId)
        ? currentIds.filter((id) => id !== categoryId)
        : [...currentIds, categoryId]
    );
  }

  async function saveCategories() {
    setStatus("saving");

    const response = await fetch("/api/onboarding/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: selectedIds }),
    });

    if (response.ok) {
      setStatus("saved");
      router.push("/onboarding/favorites");
      router.refresh();
      return;
    }

    setStatus("error");
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const isSelected = selectedSet.has(category.id);

          return (
            <label
              key={category.id}
              className={`flex min-h-44 cursor-pointer flex-col justify-between rounded-lg border bg-white/80 p-5 shadow-sm transition ${
                isSelected
                  ? "border-[#3c6e71] ring-2 ring-[#3c6e71]/25"
                  : "border-[#ded6c7] hover:border-[#bfc9c2]"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCategory(category.id)}
                className="sr-only"
              />
              <span>
                <span className="flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-[#1f2428]">
                    {category.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-10 items-center rounded-full p-1 transition ${
                      isSelected ? "bg-[#3c6e71]" : "bg-[#d8d0c3]"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white transition ${
                        isSelected ? "translate-x-4" : ""
                      }`}
                    />
                  </span>
                </span>
                <span className="mt-3 block text-sm leading-6 text-[#4f5f63]">
                  {category.description}
                </span>
              </span>
              <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f7d72]">
                {category.itemType.replace("_", " ")}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={saveCategories}
          disabled={selectedCount === 0 || status === "saving"}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save categories"}
        </button>
        <p className="text-sm text-[#4f5f63]">
          {status === "saved"
            ? "Saved."
            : status === "error"
              ? "Could not save categories."
              : `${selectedCount} selected`}
        </p>
      </div>
    </div>
  );
}
