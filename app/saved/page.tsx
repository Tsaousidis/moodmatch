import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WatchlistWorkspace } from "@/components/saved-items/watchlist-workspace";
import { authOptions } from "@/lib/auth";
import { getSavedItems } from "@/lib/saved-items/service";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/saved");
  }

  const items = await getSavedItems(session.user.id);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Saved
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Keep the good possibilities close.
            </h1>
            <p className="mt-3 text-[#4f5f63]">
              Filter saved picks by mood, or let Moodmatch make the decision.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <WatchlistWorkspace initialItems={items} />
      </div>
    </main>
  );
}
