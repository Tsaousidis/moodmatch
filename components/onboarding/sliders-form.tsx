"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SliderCategory = {
  id: string;
  name: string;
};

type SliderValues = {
  categoryId: string | null;
  novelty: number;
  comfort: number;
  depth: number;
  energy: number;
  weirdness: number;
  social: number;
};

const sliderFields = [
  ["novelty", "Novelty"],
  ["comfort", "Comfort"],
  ["depth", "Depth"],
  ["energy", "Energy"],
  ["weirdness", "Weirdness"],
  ["social", "Social"],
] as const;

export function SlidersForm({
  categories,
  values,
}: {
  categories: SliderCategory[];
  values: SliderValues[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const valueByCategory = new Map(
    values.map((value) => [value.categoryId, value])
  );

  async function saveSliders(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const formData = new FormData(event.currentTarget);
    const rows = categories.map((category) => {
      const row: Record<string, number | string> = { categoryId: category.id };

      for (const [field] of sliderFields) {
        row[field] = Number(formData.get(`${category.id}:${field}`) ?? 50);
      }

      return row;
    });

    const response = await fetch("/api/onboarding/sliders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });

    if (response.ok) {
      setStatus("saved");
      router.push("/onboarding/taste-dna");
      router.refresh();
      return;
    }

    setStatus("error");
  }

  return (
    <form onSubmit={saveSliders} className="space-y-5">
      {categories.map((category) => {
        const current = valueByCategory.get(category.id);

        return (
          <section
            key={category.id}
            className="rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#1f2428]">
              {category.name}
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {sliderFields.map(([field, label]) => (
                <label key={field} className="block">
                  <span className="text-sm font-medium text-[#354247]">
                    {label}
                  </span>
                  <input
                    name={`${category.id}:${field}`}
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={current?.[field] ?? 50}
                    className="mt-2 w-full accent-[#3c6e71]"
                  />
                </label>
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "saving"}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save sliders"}
        </button>
        <p className="text-sm text-[#4f5f63]">
          {status === "saved"
            ? "Saved."
            : status === "error"
              ? "Could not save sliders."
              : `${categories.length} categories`}
        </p>
      </div>
    </form>
  );
}
