"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

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
  const [status, setStatus] = useState<
    "idle" | "generating" | "ready" | "error"
  >(initialTasteDna ? "ready" : "idle");
  const isGeneratingRef = useRef(false);

  async function generate() {
    if (isGeneratingRef.current) {
      return;
    }

    isGeneratingRef.current = true;
    setStatus("generating");

    try {
      const response = await fetch("/api/onboarding/taste-dna", {
        method: "POST",
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const body = (await response.json()) as { tasteDna: TasteDnaRecord };
      setTasteDna(body.tasteDna);
      setStatus("ready");
      router.refresh();
    } catch {
      setStatus("error");
    } finally {
      isGeneratingRef.current = false;
    }
  }

  const traits = tasteDna?.traits ?? {};
  const anchors = readStringList(traits.anchors);
  const moodKeywords = readStringList(traits.moodKeywords);
  const avoidances = readStringList(traits.avoidances);

  return (
    <div>
      <div className="rounded-lg border border-[#ded6c7] bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f7d72]">
              Final step
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f2428]">
              Turn your onboarding into recommendations.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4f5f63]">
              Moodmatch will use your categories, favorites, experienced items,
              comfort settings, and sliders to create your starter taste profile.
              After this, you can open Today and start rating recommendations.
            </p>
          </div>

          {tasteDna ? (
            <Link
              href="/today"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40]"
              style={{ color: "var(--on-primary)" }}
            >
              Go to Today
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={generate}
              disabled={status === "generating"}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "var(--on-primary)" }}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {status === "generating" ? "Generating..." : "Generate Taste DNA"}
            </button>
          )}
        </div>

        <div aria-live="polite" className="mt-5">
          {status === "generating" ? (
            <div className="rounded-lg border border-[#ded6c7] bg-[#f7f3ec] px-4 py-3 text-sm text-[#4f5f63]">
              Building your profile. This usually takes a few seconds. You can
              stay on this page while Moodmatch prepares your first match.
            </div>
          ) : null}

          {status === "ready" && tasteDna ? (
            <div className="flex flex-col gap-3 rounded-lg border border-[#cfc7b9] bg-[#f7f3ec] px-4 py-3 text-sm text-[#4f5f63] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Taste DNA is ready. Next, open Today to see your first Perfect
                Match and start teaching Moodmatch what works.
              </span>
              <button
                type="button"
                onClick={generate}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#cfc7b9] bg-white px-3 text-xs font-semibold text-[#344347] transition hover:border-[#3c6e71]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Regenerate
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {status === "error" ? (
        <p className="mt-4 rounded-lg bg-[#f8dfd7] px-3 py-2 text-sm text-[#7a2e1f]">
          Could not generate Taste DNA. Please try again in a moment.
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
