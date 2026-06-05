"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ComfortValues = {
  avoidSpoilers: boolean;
  avoidExplicitContent: boolean;
  avoidViolence: boolean;
  avoidHorror: boolean;
  avoidSadEndings: boolean;
  customAvoidList: string[];
};

const options = [
  ["avoidSpoilers", "Avoid spoilers"],
  ["avoidExplicitContent", "Avoid explicit content"],
  ["avoidViolence", "Avoid heavy violence"],
  ["avoidHorror", "Avoid horror"],
  ["avoidSadEndings", "Avoid sad endings"],
] as const;

export function ComfortForm({ values }: { values: ComfortValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function saveComfort(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const formData = new FormData(event.currentTarget);
    const payload = {
      avoidSpoilers: formData.has("avoidSpoilers"),
      avoidExplicitContent: formData.has("avoidExplicitContent"),
      avoidViolence: formData.has("avoidViolence"),
      avoidHorror: formData.has("avoidHorror"),
      avoidSadEndings: formData.has("avoidSadEndings"),
      customAvoidList: String(formData.get("customAvoidList") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/onboarding/comfort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("saved");
      router.push("/onboarding/sliders");
      router.refresh();
      return;
    }

    setStatus("error");
  }

  return (
    <form onSubmit={saveComfort}>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map(([name, label]) => (
          <label
            key={name}
            className="flex min-h-20 items-center gap-3 rounded-lg border border-[#ded6c7] bg-white/80 p-4 shadow-sm"
          >
            <input
              name={name}
              type="checkbox"
              defaultChecked={values[name]}
              className="h-5 w-5 accent-[#3c6e71]"
            />
            <span className="text-sm font-semibold text-[#1f2428]">
              {label}
            </span>
          </label>
        ))}
      </div>

      <label className="mt-5 block max-w-2xl">
        <span className="text-sm font-medium text-[#354247]">
          Custom avoid list
        </span>
        <input
          name="customAvoidList"
          defaultValue={values.customAvoidList.join(", ")}
          placeholder="e.g. spiders, jump scares, illness"
          className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none transition focus:border-[#3c6e71]"
        />
      </label>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "saving"}
          className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save comfort settings"}
        </button>
        <p className="text-sm text-[#4f5f63]">
          {status === "saved"
            ? "Saved."
            : status === "error"
              ? "Could not save comfort settings."
              : "Ready"}
        </p>
      </div>
    </form>
  );
}
