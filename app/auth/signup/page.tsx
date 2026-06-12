import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("/moodmatch-hero.png")' }}
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <p className="font-display text-2xl font-semibold">Moodmatch</p>
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tertiary-fixed">
              Build a living profile
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
              Discover entertainment that mirrors your curiosity.
            </h1>
          </div>
          <p className="text-sm text-on-primary-container">
            Every rating makes the next match more personal.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </section>
    </main>
  );
}
