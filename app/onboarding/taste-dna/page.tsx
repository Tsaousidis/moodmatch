import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { TasteDnaGenerator } from "@/components/taste-dna/taste-dna-generator";
import { authOptions } from "@/lib/auth";
import { getLatestTasteDna } from "@/lib/onboarding/taste-dna";

export const dynamic = "force-dynamic";

export default async function OnboardingTasteDnaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/taste-dna");
  }

  const latestTasteDna = await getLatestTasteDna(session.user.id);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 7
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Generate Taste DNA.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Moodmatch turns your first signals into a living profile that can
            improve with every rating.
          </p>
        </div>

        <div className="mt-8">
          <TasteDnaGenerator initialTasteDna={latestTasteDna} />
        </div>
      </div>
    </main>
  );
}
