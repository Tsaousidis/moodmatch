import {
  ArrowRight,
  BookOpen,
  Dna,
  Gamepad2,
  Library,
  Menu,
  MoonStar,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const loopSteps = [
  {
    icon: Star,
    number: "1. Rate",
    text: "Rate what you have loved and loathed. Moodmatch captures the shape of your preferences, not just genres.",
    tone: "bg-primary-container text-tertiary-fixed",
  },
  {
    icon: Dna,
    number: "2. Learn",
    text: "Your choices become semantic signals, from pacing and tone to atmosphere, novelty, and emotional weight.",
    tone: "bg-secondary-container text-on-secondary-fixed",
  },
  {
    icon: Sparkles,
    number: "3. Match",
    text: "Get precise recommendations across movies, books, and games that fit your current headspace.",
    tone: "bg-tertiary text-tertiary-fixed",
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-surface text-on-surface">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/85 px-6 backdrop-blur-md">
        <Link
          href="/"
          className="font-display text-2xl font-semibold text-primary"
        >
          Moodmatch
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#discover"
            className="text-sm font-semibold text-on-surface-variant hover:text-secondary"
          >
            Discover
          </a>
          <a
            href="#methodology"
            className="text-sm font-semibold text-on-surface-variant hover:text-secondary"
          >
            How it Works
          </a>
          <a
            href="#group-mode"
            className="text-sm font-semibold text-on-surface-variant hover:text-secondary"
          >
            Group Mode
          </a>
          <Link
            href="/auth/signup"
            className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary"
          >
            Build your Taste DNA
          </Link>
        </nav>
        <Link
          href="/auth/login"
          aria-label="Open login"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant text-primary md:hidden"
        >
          <Menu size={20} />
        </Link>
      </header>

      <section className="relative flex min-h-screen items-center px-6 pb-12 pt-24">
        <Image
          src="/moodmatch-hero.png"
          alt="A cinematic entertainment night with books, games, and a movie"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,37,39,.38),rgba(20,37,39,.88))]" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1200px] md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary-fixed">
              A living taste profile
            </p>
            <h1 className="mt-4 font-display text-6xl font-semibold leading-none text-white sm:text-7xl">
              Moodmatch.
            </h1>
            <p className="mt-5 max-w-lg font-display text-2xl leading-snug text-surface-container-high">
              Find the right movie, book, or game for your current mood. Guided
              by your unique Taste DNA.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary-container px-7 text-sm font-semibold text-on-secondary-fixed transition-transform hover:scale-[1.02]"
              >
                Build your Taste DNA <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="methodology" className="bg-surface-container-low px-6 py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              The Methodology
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary">
              How the Taste DNA Loop Works
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {loopSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.number}
                  className="editorial-shadow flex flex-col items-center rounded-xl border border-outline-variant bg-surface p-7 text-center"
                >
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${step.tone}`}
                  >
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">
                    {step.number}
                  </h3>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="discover" className="bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-12">
          <article className="relative overflow-hidden rounded-xl bg-primary-container p-8 text-white md:col-span-8 md:min-h-[360px]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tertiary-fixed">
              Precision, not popularity
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              The Perfect Match
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-on-primary-container">
              The Match Meter is a probability shaped by your evolving Taste
              DNA, ensuring your evening is never wasted on merely okay content.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <span className="flex h-32 w-32 items-center justify-center rounded-full border-[9px] border-secondary-container font-display text-3xl font-semibold">
                90%
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary-container">
                  Vibe Match
                </p>
                <p className="mt-2 font-display text-2xl">
                  High melancholy, low pace
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-outline-variant bg-surface-container-high p-7 md:col-span-4">
            <MoonStar size={36} className="text-primary" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-primary">
              Mood-First Filter
            </h3>
            <p className="mt-3 leading-7 text-on-surface-variant">
              Switch between moods instantly. Your Taste DNA adapts without
              forgetting what makes a recommendation feel like you.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-lg border border-outline-variant bg-surface px-3 py-2">
                Ethereal
              </span>
              <span className="rounded-lg bg-primary px-3 py-2 text-on-primary">
                Cozy
              </span>
              <span className="rounded-lg border border-outline-variant bg-surface px-3 py-2">
                Suspenseful
              </span>
            </div>
          </article>

          <article className="rounded-xl bg-secondary-fixed p-7 md:col-span-4">
            <Library size={32} />
            <h3 className="mt-5 font-display text-2xl font-semibold text-on-secondary-fixed">
              Editorial Depth
            </h3>
            <p className="mt-3 leading-7 text-[#6e3900]">
              Curated metadata that goes beyond ratings. Discover the why behind
              every recommendation.
            </p>
          </article>

          <article className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-bright p-7 sm:flex-row sm:items-center md:col-span-8">
            <span className="flex h-28 w-full shrink-0 items-center justify-center rounded-lg bg-primary text-tertiary-fixed sm:w-28">
              <Sparkles size={38} />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-primary">
                Cross-Category Intelligence
              </h3>
              <p className="mt-3 leading-7 text-on-surface-variant">
                Loved a slow-burn sci-fi film? Find the novel and strategy game
                that share its tempo and emotional tone.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface px-6 py-10">
        <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-3">
          {[
            [Gamepad2, "Movies & Games"],
            [BookOpen, "Books & Stories"],
            [Search, "One precise search"],
          ].map(([Icon, label]) => (
            <div
              key={String(label)}
              className="flex items-center justify-center gap-3 text-primary"
            >
              <Icon size={30} />
              <span className="font-display text-2xl font-semibold">
                {String(label)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="group-mode" className="bg-tertiary px-6 py-20 text-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary-fixed">
              Better together
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold">
              Movie Night: The DNA Collision
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-tertiary-fixed/75">
              Combine everyone&apos;s preferences to find the overlap, then
              compare safe picks, compromises, and one worthwhile wildcard.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-tertiary-fixed px-5 text-sm font-semibold text-tertiary"
            >
              Start matching <ArrowRight size={16} />
            </Link>
          </div>
          <div className="editorial-shadow rounded-xl border border-white/15 bg-white/5 p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed">
                <Users size={25} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-tertiary-fixed">
                  Group Taste Profile
                </p>
                <p className="mt-1 font-display text-2xl">
                  Shared priorities, visible tensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary px-6 py-10 text-on-primary-container">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-2xl font-semibold text-white">
            Moodmatch
          </p>
          <p className="text-sm">Designed for discovery.</p>
        </div>
      </footer>
    </main>
  );
}
