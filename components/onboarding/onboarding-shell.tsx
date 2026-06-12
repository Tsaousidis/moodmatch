"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const steps = [
  ["/onboarding/categories", "Categories"],
  ["/onboarding/favorites", "Favorites"],
  ["/onboarding/already-experienced", "Experienced"],
  ["/onboarding/tags", "Taste Tags"],
  ["/onboarding/comfort", "Comfort"],
  ["/onboarding/sliders", "Sliders"],
  ["/onboarding/taste-dna", "Taste DNA"],
] as const;

export function OnboardingShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentIndex = steps.findIndex(([href]) => pathname === href);

  if (pathname === "/onboarding") {
    return children;
  }

  return (
    <div className="onboarding-shell min-h-screen bg-surface text-on-surface">
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-semibold text-primary"
          >
            <Sparkles size={18} />
            Moodmatch
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
            Taste DNA Setup
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-outline-variant px-5 py-10 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            Your progress
          </p>
          <nav className="mt-6 space-y-1">
            {steps.map(([href, label], index) => {
              const active = index === currentIndex;
              const complete = index < currentIndex;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                    active
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                      active
                        ? "border-tertiary-fixed text-tertiary-fixed"
                        : complete
                          ? "border-tertiary bg-tertiary text-white"
                          : "border-outline-variant"
                    }`}
                  >
                    {complete ? <Check size={12} /> : index + 1}
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div>
          <div className="border-b border-outline-variant px-6 py-3 lg:hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant">
              <span>
                Step {Math.max(1, currentIndex + 1)} of {steps.length}
              </span>
              <span>{steps[Math.max(0, currentIndex)]?.[1]}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full bg-secondary-container"
                style={{
                  width: `${((Math.max(0, currentIndex) + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
