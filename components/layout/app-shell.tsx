"use client";

import {
  Bookmark,
  Compass,
  Dna,
  Home,
  Library,
  Menu,
  MessageCircleQuestion,
  MoonStar,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

const appRoutes = [
  "/today",
  "/discover",
  "/taste-dna",
  "/explain-taste",
  "/ratings",
  "/saved",
  "/quests",
  "/movie-night",
  "/profile",
];

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/taste-dna", label: "Taste DNA", icon: Dna },
  {
    href: "/explain-taste",
    label: "Explain My Taste",
    icon: MessageCircleQuestion,
  },
  { href: "/ratings", label: "Ratings", icon: Library },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/quests", label: "Taste Quests", icon: Trophy },
  { href: "/movie-night", label: "Movie Night", icon: MoonStar },
  { href: "/profile", label: "Profile", icon: Settings },
];

const mobileItems = [
  navItems[0],
  navItems[1],
  navItems[2],
  navItems[5],
  navItems[8],
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAppRoute = appRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isAppRoute) {
    return children;
  }

  const userName = session?.user?.name || "Taste Explorer";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell min-h-screen bg-surface text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-5 lg:flex">
        <Link
          href="/today"
          className="flex items-center gap-3 px-3 font-display text-2xl font-semibold text-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Sparkles size={18} />
          </span>
          Moodmatch
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/profile"
          className="flex items-center gap-3 border-t border-outline-variant px-2 pt-5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-sm font-bold text-on-secondary-fixed">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {userName}
            </span>
            <span className="block text-xs text-on-surface-variant">
              View profile
            </span>
          </span>
        </Link>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/95 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/today"
          className="font-display text-xl font-semibold text-primary"
        >
          Moodmatch
        </Link>
        <Link
          href="/profile"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-primary"
        >
          <Menu size={20} />
        </Link>
      </header>

      <div className="min-h-screen pb-20 pt-16 lg:ml-64 lg:pb-0 lg:pt-0">
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-18 grid-cols-5 border-t border-outline-variant bg-surface-container-lowest/95 px-1 backdrop-blur-md lg:hidden">
        {mobileItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
                active ? "text-secondary" : "text-on-surface-variant"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className="max-w-full truncate">
                {item.label === "Taste DNA" ? "DNA" : item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
