import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CategorySelector } from "@/components/onboarding/category-selector";
import { ComfortForm } from "@/components/onboarding/comfort-form";
import { ItemSelector } from "@/components/onboarding/item-selector";
import { authOptions } from "@/lib/auth";
import { getProfilePreferences } from "@/lib/profile/preferences";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  const preferences = await getProfilePreferences(session.user.id);

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-12 text-[#1f2428]">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-[#ded6c7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
              Moodmatch / Profile
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Profile and preferences.
            </h1>
            <p className="mt-3 text-[#4f5f63]">
              Keep the signals Moodmatch uses aligned with your current taste.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex h-10 items-center rounded-lg border border-[#cfc7b9] bg-white/70 px-4 text-sm font-semibold"
          >
            Back to Today
          </Link>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2">
          <a
            href="#categories"
            className="rounded-lg bg-[#1f2428] px-4 py-2 text-sm font-semibold text-white"
          >
            Categories
          </a>
          <a
            href="#comfort"
            className="rounded-lg border border-[#cfc7b9] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            Comfort
          </a>
          <a
            href="#experienced"
            className="rounded-lg border border-[#cfc7b9] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            Experienced
          </a>
        </nav>

        <section id="categories" className="scroll-mt-6 border-b border-[#ded6c7] py-10">
          <SectionHeading
            label="Categories"
            title="What should Moodmatch recommend?"
            description="Choose the categories that belong in your recommendation mix."
          />
          <div className="mt-6">
            <CategorySelector
              categories={preferences.categoryOptions}
              selectedCategoryIds={preferences.selectedCategoryIds}
              nextPath={null}
            />
          </div>
        </section>

        <section id="comfort" className="scroll-mt-6 border-b border-[#ded6c7] py-10">
          <SectionHeading
            label="Content Comfort"
            title="Set your boundaries."
            description="Update the content Moodmatch should handle carefully or avoid."
          />
          <div className="mt-6">
            <ComfortForm values={preferences.comfortValues} nextPath={null} />
          </div>
        </section>

        <section id="experienced" className="scroll-mt-6 py-10">
          <SectionHeading
            label="Already Experienced"
            title="Manage what you already know."
            description="Keep this list current so recommendations avoid obvious repeats."
          />
          <div className="mt-6">
            <ItemSelector
              items={preferences.itemOptions}
              selectedItemIds={preferences.experiencedItemIds}
              apiPath="/api/onboarding/already-experienced"
              saveLabel="Save experienced items"
              emptyError="Could not save experienced items."
              allowEmpty
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c6e71]">
        {label}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-[#4f5f63]">{description}</p>
    </div>
  );
}
