"use client";

import {
  Bookmark,
  Compass,
  Dna,
  Home,
  Library,
  LogOut,
  MessageCircleQuestion,
  MoonStar,
  Settings,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { type ReactNode, useState } from "react";

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

const mobileBottomItems = [
  navItems[0], // Today
  navItems[1], // Discover
  navItems[2], // Taste DNA
  navItems[5], // Saved
  navItems[8], // Profile
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
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
}

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Taste Explorer";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Link
        href="/today"
        onClick={onLinkClick}
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
          return (
            <NavLink
              key={item.href}
              item={item}
              active={active}
              onClick={onLinkClick}
            />
          );
        })}
      </nav>

      <div className="border-t border-outline-variant pt-4">
        <Link
          href="/profile"
          onClick={onLinkClick}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-container"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-sm font-bold text-on-secondary-fixed">
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

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-1 flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Log out
        </button>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAppRoute = appRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isAppRoute) {
    return children;
  }

  return (
    <div className="app-shell min-h-screen bg-surface text-on-surface">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-5 lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/95 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/today"
          className="font-display text-xl font-semibold text-primary"
        >
          Moodmatch
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-primary"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="14" x2="17" y2="14" />
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />

          {/* Drawer Panel */}
          <div
            className="absolute inset-y-0 right-0 flex w-72 flex-col border-l border-outline-variant bg-surface-container-lowest px-4 py-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-primary">
                Moodmatch
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 flex flex-1 flex-col overflow-y-auto">
              <SidebarContent
                pathname={pathname}
                onLinkClick={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="min-h-screen pb-20 pt-16 lg:ml-64 lg:pb-0 lg:pt-0">
        {children}
      </div>

      {/* Mobile Bottom Nav (quick access to 5 main items) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-18 grid-cols-5 border-t border-outline-variant bg-surface-container-lowest/95 px-1 backdrop-blur-md lg:hidden">
        {mobileBottomItems.map((item) => {
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
