import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AffinityRadar } from "@/components/taste-dna/affinity-radar";
import { authOptions } from "@/lib/auth";
import { getTasteDnaPageData } from "@/lib/taste-dna/page-data";

export const dynamic = "force-dynamic";

export default async function TasteDnaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/taste-dna");
  }

  const dna = await getTasteDnaPageData(session.user.id);

  if (!dna) {
    redirect("/onboarding/taste-dna");
  }

  const confidencePercent = Math.round(dna.confidence * 100);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Taste DNA
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Your taste, in motion.
            </h1>
            <p className="mt-3 max-w-2xl text-[#4f5f63]">{dna.summary}</p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-[#ded6c7] bg-white/80 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
                  Category Affinity
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Where your curiosity pulls.
                </h2>
              </div>
              <span className="rounded-lg bg-[#e6eee9] px-3 py-2 text-sm font-semibold text-[#315d60]">
                Version {dna.version}
              </span>
            </div>
            <AffinityRadar affinities={dna.affinities} />
          </div>

          <div className="grid gap-5">
            <section className="rounded-lg border border-[#ded6c7] bg-[#1f2428] p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9bc2bd]">
                Profile Confidence
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-5xl font-semibold">{confidencePercent}%</p>
                <p className="max-w-48 text-right text-sm text-[#cbd5d4]">
                  Every rating sharpens the profile and raises confidence.
                </p>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#e4a853]"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </section>

            <section className="rounded-lg border border-[#ded6c7] bg-white/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#b85c38]">
                Recommendation Style
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                {dna.recommendationStyle}
              </h2>
              <p className="mt-4 text-sm text-[#657074]">
                Updated {formatDate(dna.updatedAt)} by{" "}
                {formatGeneratedBy(dna.generatedBy)}.
              </p>
            </section>
          </div>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          <TraitSection
            eyebrow="Taste Anchors"
            title="Reliable signals"
            items={dna.anchors}
            empty="Rate a few picks to reveal your strongest anchors."
            tone="anchor"
          />
          <TraitSection
            eyebrow="Mood Keywords"
            title="What feels right"
            items={dna.moodKeywords}
            empty="Mood signals will appear as your profile grows."
            tone="mood"
          />
          <TraitSection
            eyebrow="Boundaries"
            title="What to steer around"
            items={dna.avoidances}
            empty="No strong avoidances recorded yet."
            tone="boundary"
          />
        </section>

        <section className="mt-10 border-t border-[#ded6c7] pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
                Recent Signals
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Ratings that changed the picture.
              </h2>
            </div>
            <Link
              href="/ratings"
              className="text-sm font-semibold text-[#315d60] underline-offset-4 hover:underline"
            >
              View ratings library
            </Link>
          </div>

          {dna.ratingSignals.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dna.ratingSignals.map((signal, index) => (
                <article
                  key={`${signal.title}-${index}`}
                  className="rounded-lg border border-[#ded6c7] bg-white/80 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">{signal.title}</h3>
                    <span className="shrink-0 text-sm font-semibold text-[#b85c38]">
                      {signal.rating}/5
                    </span>
                  </div>
                  <SignalLine label="Liked" items={signal.likedTraits} />
                  <SignalLine
                    label="Less of"
                    items={signal.dislikedTraits}
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#cfc7b9] px-6 py-8 text-[#657074]">
              Your next rating will become the first visible learning signal.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TraitSection({
  eyebrow,
  title,
  items,
  empty,
  tone,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  empty: string;
  tone: "anchor" | "mood" | "boundary";
}) {
  const colors = {
    anchor: "bg-[#e6eee9] text-[#315d60]",
    mood: "bg-[#f2e6d3] text-[#805421]",
    boundary: "bg-[#eee3df] text-[#824a37]",
  };

  return (
    <article className="rounded-lg border border-[#ded6c7] bg-white/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#657074]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${colors[tone]}`}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#657074]">{empty}</p>
      )}
    </article>
  );
}

function SignalLine({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p className="mt-3 text-sm text-[#657074]">
      <span className="font-semibold text-[#344347]">{label}:</span>{" "}
      {items.join(", ")}
    </p>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatGeneratedBy(value: string) {
  if (value === "azure-ai") return "Azure AI";
  if (value === "rating-update") return "your latest rating";
  if (value === "local-fallback") return "Moodmatch starter model";
  return value;
}
