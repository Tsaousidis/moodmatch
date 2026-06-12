import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MovieNightWorkspace } from "@/components/movie-night/movie-night-workspace";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MovieNightPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/movie-night");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Movie Night
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Find the overlap everyone can enjoy.
            </h1>
            <p className="mt-3 max-w-2xl text-[#4f5f63]">
              Turn several preferences into one confident group pick, a few
              compromises, and a wildcard worth discussing.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <div className="mt-8">
          <MovieNightWorkspace />
        </div>
      </div>
    </main>
  );
}
