import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PerfectMatchCard } from "@/components/home/perfect-match-card";
import { RecommendationCard } from "@/components/home/recommendation-card";
import { LevelProgress } from "@/components/progress/level-progress";
import { authOptions } from "@/lib/auth";
import { getUserProgress } from "@/lib/progress/xp";
import { getHomeRecommendations } from "@/lib/recommendations/home";

export default async function TodayPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/today");
  }

  const [home, progress] = await Promise.all([
    getHomeRecommendations(session.user.id),
    getUserProgress(session.user.id),
  ]);

  if (!home.isOnboarded) {
    return (
      <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
            Home / Today
          </p>
          <h1 className="mt-4 text-4xl font-semibold">
            Your first match starts with a few signals.
          </h1>
          <p className="mt-4 max-w-2xl text-[#4f5f63]">
            Complete onboarding so Moodmatch can build your Taste DNA and
            prepare today&apos;s recommendation.
          </p>
          <Link
            href="/onboarding/categories"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#1f2428] px-5 text-sm font-semibold text-white transition hover:bg-[#343b40]"
          >
            Start onboarding
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Today
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Good to see you{session.user.name ? `, ${session.user.name}` : ""}.
            </h1>
            <p className="mt-3 text-[#4f5f63]">
              One strong match, then a few directions worth exploring.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              href="/discover"
              className="inline-flex h-10 items-center rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white"
            >
              Discover
            </Link>
            <Link
              href="/taste-dna"
              className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
            >
              Taste DNA
            </Link>
            <Link
              href="/ratings"
              className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
            >
              Ratings
            </Link>
            <Link
              href="/quests"
              className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
            >
              Quests
            </Link>
            <Link
              href="/profile"
              className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
            >
              Profile
            </Link>
          </nav>
        </header>

        <div className="mt-6 max-w-md">
          <LevelProgress progress={progress} compact />
        </div>

        <div className="mt-8">
          {home.perfectMatch ? (
            <PerfectMatchCard recommendation={home.perfectMatch} />
          ) : (
            <p className="rounded-lg border border-[#ded6c7] bg-white/80 p-6 text-[#4f5f63]">
              Add more categories to unlock today&apos;s Perfect Match.
            </p>
          )}
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
                More Picks
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Different directions, same taste.
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {home.morePicks.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
