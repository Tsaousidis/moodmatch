import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { FavoritesSelector } from "@/components/onboarding/favorites-selector";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userCategories, userFavorites } from "@/lib/db/schema";
import { ensurePopularItemsForCategoryIds } from "@/lib/items/popular";

export const dynamic = "force-dynamic";

export default async function OnboardingFavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/favorites");
  }

  const selectedCategories = await db
    .select({ categoryId: userCategories.categoryId })
    .from(userCategories)
    .where(eq(userCategories.userId, session.user.id));

  if (selectedCategories.length === 0) {
    redirect("/onboarding/categories");
  }

  const [suggestions, favoriteRows] = await Promise.all([
    ensurePopularItemsForCategoryIds(
      selectedCategories.map((category) => category.categoryId)
    ),
    db
      .select({ itemId: userFavorites.itemId })
      .from(userFavorites)
      .where(eq(userFavorites.userId, session.user.id)),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 2
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Add favorites.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Choose a few examples you already love. These become the first
            strong signals for your Taste DNA.
          </p>
        </div>

        <div className="mt-8">
          <FavoritesSelector
            items={suggestions}
            selectedItemIds={favoriteRows.map((favorite) => favorite.itemId)}
          />
        </div>
      </div>
    </main>
  );
}
