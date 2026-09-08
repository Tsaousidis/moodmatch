import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
        <Compass size={36} strokeWidth={1.5} />
      </span>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        404 — Not Found
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-primary">
        Lost in the mix.
      </h1>
      <p className="mt-5 max-w-md text-lg leading-7 text-on-surface-variant">
        This page doesn&apos;t exist. Maybe it was moved, or perhaps your Taste
        DNA led you somewhere unexpected.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/today"
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Today
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-xl border border-outline-variant px-7 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
        >
          Go to homepage
        </Link>
      </div>

      <p className="mt-16 font-display text-sm font-semibold text-outline">
        Moodmatch
      </p>
    </main>
  );
}
