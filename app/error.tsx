"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-error-container text-error">
        <AlertTriangle size={36} strokeWidth={1.5} />
      </span>

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-error">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold text-primary">
        An unexpected error.
      </h1>
      <p className="mt-5 max-w-md text-lg leading-7 text-on-surface-variant">
        Moodmatch hit an unexpected snag. This is on us — try refreshing, or
        head back to safety.
      </p>

      {error?.digest && (
        <p className="mt-4 rounded-lg bg-surface-container px-4 py-2 font-mono text-xs text-on-surface-variant">
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/today"
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-outline-variant px-7 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
        >
          <ArrowLeft size={16} />
          Back to Today
        </Link>
      </div>

      <p className="mt-16 font-display text-sm font-semibold text-outline">
        Moodmatch
      </p>
    </main>
  );
}
