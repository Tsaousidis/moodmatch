import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { DiscoverWorkspace } from "@/components/discover/discover-workspace";
import { authOptions } from "@/lib/auth";
import { getDiscoverRecommendations } from "@/lib/recommendations/discover";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/discover");
  }

  const initialResults = await getDiscoverRecommendations(session.user.id, {
    vibe: "",
    categoryId: null,
    novelty: 50,
    comfort: 50,
    energy: 50,
  });

  if (initialResults.categories.length === 0) {
    redirect("/onboarding/categories");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Moodmatch / Discover
        </p>
        <div className="mt-3 max-w-3xl">
          <h1 className="text-4xl font-semibold">Describe the moment.</h1>
          <p className="mt-3 text-[#4f5f63]">
            Shape the vibe, tune the sliders, and get one strong Perfect Match.
          </p>
        </div>

        <div className="mt-8">
          <DiscoverWorkspace
            categories={initialResults.categories}
            initialResults={initialResults}
          />
        </div>
      </div>
    </main>
  );
}
