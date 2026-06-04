import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { CategorySelector } from "@/components/onboarding/category-selector";
import { authOptions } from "@/lib/auth";
import { ensureDefaultCategories } from "@/lib/categories/defaults";
import { db } from "@/lib/db";
import { userCategories } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function OnboardingCategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/categories");
  }

  const [categoryOptions, selectedCategories] = await Promise.all([
    ensureDefaultCategories(),
    db
      .select({ categoryId: userCategories.categoryId })
      .from(userCategories)
      .where(eq(userCategories.userId, session.user.id)),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 1
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Choose your categories.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Pick the areas where Moodmatch should start learning your taste.
          </p>
        </div>

        <div className="mt-8">
          <CategorySelector
            categories={categoryOptions}
            selectedCategoryIds={selectedCategories.map(
              (category) => category.categoryId
            )}
          />
        </div>
      </div>
    </main>
  );
}
