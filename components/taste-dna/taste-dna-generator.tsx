"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TasteDnaRecord = {
  id: string;
  version: number;
  summary: string | null;
  generatedBy: string | null;
  traits: Record<string, unknown>;
};

export function TasteDnaGenerator({
  initialTasteDna,
}: {
  initialTasteDna: TasteDnaRecord | null;
}) {
  const router = useRouter();
  const [tasteDna, setTasteDna] = useState(initialTasteDna);
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  async function generate() {
    setStatus("generating");

    const response = await fetch("/api/onboarding/taste-dna", {
      method: "POST",
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const body = (await response.json()) as { tasteDna: TasteDnaRecord };
    setTasteDna(body.tasteDna);
    setStatus("idle");
    router.refresh();
  }

  const traits = tasteDna?.traits ?? {};
  const anchors = readStringList(traits.anchors);
  const moodKeywords = readStringList(traits.moodKeywords);
  const avoidances = readStringList(traits.avoidances);

  return (
    <div>
      <button
        type="button"
        onClick={generate}
        disabled={status === "generating"}
        className="h-11 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "generating" ? "Generating..." : "Generate Taste DNA"}
      </button>

      {status === "error" ? (
        <p className="mt-4 rounded-lg bg-[#f8dfd7] px-3 py-2 text-sm text-[#7a2e1f]">
          Could not generate Taste DNA.
        </p>
      ) : null}

      {tasteDna ? (
        <section className="mt-8 rounded-lg border border-[#ded6c7] bg-white/80 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f7d72]">
            Version {tasteDna.version} · {tasteDna.generatedBy ?? "unknown"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[#1f2428]">
            Your starter Taste DNA
          </h2>
          <p className="mt-4 max-w-3xl text-[#4f5f63]">
            {tasteDna.summary}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TraitList title="Anchors" items={anchors} />
            <TraitList title="Mood keywords" items={moodKeywords} />
            <TraitList title="Avoidances" items={avoidances} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TraitList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-[#ded6c7] bg-[#f7f3ec] p-4">
      <h3 className="text-sm font-semibold text-[#1f2428]">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {(items.length ? items : ["Not enough signal yet"]).map((item) => (
          <span
            key={item}
            className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-[#4f5f63]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function readStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
