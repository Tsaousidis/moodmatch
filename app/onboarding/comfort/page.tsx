import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { ComfortForm } from "@/components/onboarding/comfort-form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { contentComfortSettings } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const defaultComfortValues = {
  avoidSpoilers: true,
  avoidExplicitContent: false,
  avoidViolence: false,
  avoidHorror: false,
  avoidSadEndings: false,
  customAvoidList: [],
};

export default async function OnboardingComfortPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/comfort");
  }

  const [settings] = await db
    .select()
    .from(contentComfortSettings)
    .where(eq(contentComfortSettings.userId, session.user.id))
    .orderBy(desc(contentComfortSettings.updatedAt))
    .limit(1);

  const comfortValues = settings
    ? {
        avoidSpoilers: settings.avoidSpoilers,
        avoidExplicitContent: settings.avoidExplicitContent,
        avoidViolence: settings.avoidViolence,
        avoidHorror: settings.avoidHorror,
        avoidSadEndings: settings.avoidSadEndings,
        customAvoidList: settings.customAvoidList ?? [],
      }
    : defaultComfortValues;

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 5
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Set comfort boundaries.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Moodmatch should feel useful without surprising you in the wrong
            direction.
          </p>
        </div>

        <div className="mt-8">
          <ComfortForm values={comfortValues} />
        </div>
      </div>
    </main>
  );
}
