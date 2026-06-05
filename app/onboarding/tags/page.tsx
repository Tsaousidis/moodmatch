import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { TagsConfirmation } from "@/components/onboarding/tags-confirmation";
import { authOptions } from "@/lib/auth";
import {
  ensureTasteTagSuggestions,
  hasSelectedCategories,
} from "@/lib/onboarding/tags";

export const dynamic = "force-dynamic";

export default async function OnboardingTagsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/tags");
  }

  if (!(await hasSelectedCategories(session.user.id))) {
    redirect("/onboarding/categories");
  }

  const tags = await ensureTasteTagSuggestions(session.user.id);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Onboarding / Step 4
        </p>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-4xl font-semibold">Confirm taste tags.</h1>
          <p className="mt-4 text-lg leading-8 text-[#4f5f63]">
            Keep the signals that feel right and reject the ones that miss.
          </p>
        </div>

        <div className="mt-8">
          <TagsConfirmation tags={tags} />
        </div>
      </div>
    </main>
  );
}
