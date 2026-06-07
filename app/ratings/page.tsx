import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RatingHistoryList } from "@/components/ratings/library/rating-history-list";
import { authOptions } from "@/lib/auth";
import { getRatingsLibrary } from "@/lib/ratings/library";

export const dynamic = "force-dynamic";

export default async function RatingsLibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/ratings");
  }

  const library = await getRatingsLibrary(session.user.id);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Ratings Library
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Every rating matters.</h1>
            <p className="mt-3 text-[#4f5f63]">
              Your feedback history and the signals shaping Taste DNA.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total ratings" value={String(library.stats.totalRatings)} />
          <StatCard
            label="Average rating"
            value={library.stats.averageRating.toFixed(1)}
          />
          <StatCard
            label="Five-star picks"
            value={String(library.stats.fiveStarRatings)}
          />
          <StatCard
            label="Categories rated"
            value={String(library.stats.categoryCount)}
          />
        </section>

        <section className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
            By Category
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {library.categoryStats.map((category) => (
              <div
                key={category.categoryName}
                className="rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">{category.categoryName}</h2>
                <div className="mt-4 flex justify-between gap-4 text-sm text-[#4f5f63]">
                  <span>{category.count} ratings</span>
                  <span>{category.averageRating.toFixed(1)} average</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
            History
          </p>
          <div className="mt-4">
            <RatingHistoryList history={library.history} />
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#ded6c7] bg-white/80 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7d72]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#1f2428]">{value}</p>
    </div>
  );
}
