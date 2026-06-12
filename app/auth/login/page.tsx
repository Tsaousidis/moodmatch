import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <AuthVisual />
      <section className="flex items-center justify-center px-6 py-12">
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </section>
    </main>
  );
}

function AuthVisual() {
  return (
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
            Return to your Taste DNA
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
            Better picks begin with what you already know about yourself.
          </h1>
        </div>
        <p className="text-sm text-on-primary-container">
          Movies, books, games, and the mood connecting them.
        </p>
      </div>
    </section>
  );
}
