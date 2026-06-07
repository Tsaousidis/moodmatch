import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LevelProgress } from "@/components/progress/level-progress";
import { QuestList } from "@/components/quests/quest-list";
import { authOptions } from "@/lib/auth";
import { getUserProgress } from "@/lib/progress/xp";
import { getUserQuests } from "@/lib/quests/service";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/quests");
  }

  const [quests, progress] = await Promise.all([
    getUserQuests(session.user.id),
    getUserProgress(session.user.id),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Taste Quests
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Explore with a purpose.
            </h1>
            <p className="mt-3 text-[#4f5f63]">
              Each quest improves the signals behind your recommendations.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <div className="mt-6 max-w-xl">
          <LevelProgress progress={progress} />
        </div>

        <section className="mt-8">
          <QuestList quests={quests} />
        </section>
      </div>
    </main>
  );
}
