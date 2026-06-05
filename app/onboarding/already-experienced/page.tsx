import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { ItemSelector } from "@/components/onboarding/item-selector";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userAlreadyExperienced, userCategories } from "@/lib/db/schema";
import { ensurePopularItemsForCategoryIds } from "@/lib/items/popular";

export const dynamic = "force-dynamic";

export default async function OnboardingAlreadyExperiencedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/already-experienced");
  }

  const selectedCategories = await db
    .select({ categoryId: userCategories.categoryId })
    .from(userCategories)
    .where(eq(userCategories.userId, session.user.id));

  if (selectedCategories.length === 0) {
    redirect("/onboarding/categories");
  }

  const [suggestions, experiencedRows] = await Promise.all([
    ensurePopularItemsForCategoryIds(
      selectedCategories.map((category) => category.categoryId)
    ),
    db
      .select({ itemId: userAlreadyExperienced.itemId })
      .from(userAlreadyExperienced)
      .where(eq(userAlreadyExperienced.userId, session.user.id)),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 3
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Mark what you know.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Add items you have already seen, read, or played so Moodmatch can
            avoid obvious repeats.
          </p>
        </div>

        <div className="mt-8">
          <ItemSelector
            items={suggestions}
            selectedItemIds={experiencedRows.map(
              (experienced) => experienced.itemId
            )}
            apiPath="/api/onboarding/already-experienced"
            saveLabel="Save experienced items"
            emptyError="Could not save experienced items."
            nextPath="/onboarding/tags"
          />
        </div>
      </div>
    </main>
  );
}
