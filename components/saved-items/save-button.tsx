"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

export function SaveButton({
  itemId,
  initialSaved,
  variant = "light",
}: {
  itemId: string;
  initialSaved: boolean;
  variant?: "light" | "dark";
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const isDark = variant === "dark";

  async function toggle() {
    setStatus("saving");

    const response = await fetch("/api/saved-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const body = (await response.json()) as { isSaved?: boolean };

    if (!response.ok || typeof body.isSaved !== "boolean") {
      setStatus("error");
      return;
    }

    setIsSaved(body.isSaved);
    setStatus("idle");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={status === "saving"}
      aria-pressed={isSaved}
      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isSaved
          ? isDark
            ? "border-white bg-white text-[#1f2428]"
            : "border-[#3c6e71] bg-[#3c6e71] text-white"
          : isDark
            ? "border-white/30 text-white hover:border-white"
            : "border-[#cfc7b9] bg-white text-[#344347] hover:border-[#3c6e71]"
      }`}
    >
      <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
      {status === "saving" ? "Saving..." : isSaved ? "Saved" : "Save"}
    </button>
  );
}
