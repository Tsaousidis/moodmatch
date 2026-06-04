import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function TodayPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Home / Today
        </p>
        <h1 className="mt-4 text-4xl font-semibold">
          Your Perfect Match will live here.
        </h1>
        <p className="mt-4 max-w-2xl text-[#4f5f63]">
          Signed in as {session?.user?.email}. The recommendation loop starts
          after onboarding is connected.
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
