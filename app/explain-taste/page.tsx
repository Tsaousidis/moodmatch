import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TasteAiChat } from "@/components/taste-dna/taste-ai-chat";
import { createTasteInsights } from "@/lib/ai/explain-taste";
import { authOptions } from "@/lib/auth";
import { getTasteDnaPageData } from "@/lib/taste-dna/page-data";

export const dynamic = "force-dynamic";

export default async function ExplainTastePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/explain-taste");
  }

  const dna = await getTasteDnaPageData(session.user.id);

  if (!dna) {
    redirect("/onboarding/taste-dna");
  }

  const insights = createTasteInsights(dna);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Explain My Taste
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              See the reasoning behind your profile.
            </h1>
            <p className="mt-3 max-w-2xl text-[#4f5f63]">
              These insights connect your favorites, ratings, boundaries, and
              category preferences into patterns you can question.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/taste-dna"
              className="inline-flex h-10 items-center rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white"
            >
              View Taste DNA
            </Link>
            <Link
              href="/today"
              className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
            >
              Back to Today
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <article
              key={insight.label}
              className="rounded-lg border border-[#ded6c7] bg-white/80 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b85c38]">
                {insight.label}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{insight.title}</h2>
              <p className="mt-3 leading-7 text-[#4f5f63]">
                {insight.explanation}
              </p>
              {insight.evidence.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {insight.evidence.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg bg-[#e6eee9] px-3 py-2 text-xs font-semibold text-[#315d60]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-lg bg-[#1f2428] p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9bc2bd]">
              How To Read This
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              A profile, not a personality test.
            </h2>
            <p className="mt-4 leading-7 text-[#cbd5d4]">
              Taste DNA describes the signals Moodmatch currently sees. It can
              change with every rating, rejection, saved item, and new
              category you explore.
            </p>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="text-4xl font-semibold">
                {Math.round(dna.confidence * 100)}%
              </p>
              <p className="mt-2 text-sm text-[#cbd5d4]">
                Current profile confidence across version {dna.version}.
              </p>
            </div>
          </div>

          <TasteAiChat />
        </section>
      </div>
    </main>
  );
}
