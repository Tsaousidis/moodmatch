import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";

import { SlidersForm } from "@/components/onboarding/sliders-form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categories,
  userCategories,
  userSliderDefaults,
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function OnboardingSlidersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/sliders");
  }

  const [selectedCategories, sliderValues] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name })
      .from(userCategories)
      .innerJoin(categories, eq(userCategories.categoryId, categories.id))
      .where(eq(userCategories.userId, session.user.id))
      .orderBy(asc(categories.name)),
    db
      .select()
      .from(userSliderDefaults)
      .where(eq(userSliderDefaults.userId, session.user.id)),
  ]);

  if (selectedCategories.length === 0) {
    redirect("/onboarding/categories");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 6
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Set default sliders.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            These defaults shape the recommendation feel before each search.
          </p>
        </div>

        <div className="mt-8">
          <SlidersForm categories={selectedCategories} values={sliderValues} />
        </div>
      </div>
    </main>
  );
}
