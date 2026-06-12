import Image from "next/image";
import Link from "next/link";

const signals = [
  ["Rate it", "Every star and trait teaches the profile what worked."],
  ["Save it", "Future-you leaves a signal about intent and mood."],
  ["Reject it", "A clear no is useful evidence, not a dead end."],
];

const categories = ["Movies", "TV", "Books", "Board games", "Video games"];

export default function Home() {
  return (
    <main className="bg-[#f7f3ec] text-[#1f2428]">
      <section className="relative flex min-h-[92svh] overflow-hidden bg-[#111716] text-white">
        <Image
          src="/moodmatch-hero.png"
          alt="A movie-night table with a book, board game, controller, and popcorn"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,17,16,.96)_0%,rgba(11,17,16,.85)_38%,rgba(11,17,16,.28)_70%,rgba(11,17,16,.15)_100%)]" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-10 pt-5 sm:px-10">
          <nav className="flex items-center justify-between border-b border-white/20 pb-5">
            <Link href="/" className="text-lg font-semibold">
              Moodmatch
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center px-3 text-sm font-semibold text-white/90"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-semibold text-[#1f2428]"
              >
                Create account
              </Link>
            </div>
          </nav>

          <div className="flex flex-1 items-center py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9bc2bd]">
                A living taste profile
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[1.08] sm:text-7xl">
                Moodmatch
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">
                Find the right movie, book, or game for this exact mood. Every
                rating makes the next match more personal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-[#e4a853] px-6 text-sm font-semibold text-[#161b1a] transition hover:bg-[#efb966]"
                >
                  Build your Taste DNA
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/35 bg-black/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  I already have a profile
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                {categories.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
            </div>
          </div>

          <a
            href="#taste-loop"
            className="w-fit text-sm font-semibold text-white/70 underline-offset-4 hover:underline"
          >
            See how your profile learns
          </a>
        </div>
      </section>

      <section id="taste-loop" className="border-b border-[#ded6c7] py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
                The Taste Loop
              </p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold leading-tight">
                Recommendations that remember what happened next.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-[#4f5f63]">
                Moodmatch builds Taste DNA from actions, not a one-time quiz.
                The profile changes as you explore, rate, save, and reject.
              </p>
            </div>
            <div className="grid border-t border-[#cfc7b9] sm:grid-cols-3">
              {signals.map(([title, description], index) => (
                <article
                  key={title}
                  className="border-b border-[#cfc7b9] py-6 sm:border-r sm:px-5 sm:last:border-r-0"
                >
                  <p className="text-sm font-semibold text-[#b85c38]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#657074]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1f2428] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9bc2bd]">
                One strong answer
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
                Start with a Perfect Match, then understand why.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-[#cbd5d4]">
                Match score, confidence, mood fit, external ratings, trailers,
                availability, and an explanation grounded in your own signals.
              </p>
              <Link
                href="/auth/signup"
                className="mt-8 inline-flex h-11 items-center rounded-lg bg-white px-5 text-sm font-semibold text-[#1f2428]"
              >
                Find your first match
              </Link>
            </div>

            <div className="border-l-2 border-[#3c6e71] pl-6 sm:pl-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#9bc2bd]">
                <span>Perfect Match</span>
                <span className="text-white/35">/</span>
                <span>Tonight</span>
              </div>
              <h3 className="mt-5 text-3xl font-semibold">
                The pick that fits the moment.
              </h3>
              <p className="mt-5 max-w-xl leading-7 text-[#cbd5d4]">
                Moodmatch balances familiar anchors with just enough novelty,
                then keeps learning from the choice you make.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["94%", "Match score"],
                  ["86%", "Confidence"],
                  ["+10 XP", "For feedback"],
                ].map(([value, label]) => (
                  <div key={label} className="border-t border-white/20 pt-4">
                    <p className="text-2xl font-semibold text-[#e4a853]">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b85c38]">
                Better together
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight">
                Movie Night finds the overlap without flattening everyone&apos;s
                taste.
              </h2>
            </div>
            <p className="max-w-xl leading-7 text-[#4f5f63]">
              Describe the group, name what you have already seen, and get one
              confident group pick plus safe picks, compromises, and a
              wildcard.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-y border-[#cfc7b9] py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold">
                The more you use it, the better it understands you.
              </p>
              <p className="mt-2 text-sm text-[#657074]">
                Start with favorites. Build a profile that keeps moving.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#1f2428] px-6 text-sm font-semibold text-white"
            >
              Create your Taste DNA
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ded6c7] py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-[#657074] sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-semibold text-[#1f2428]">Moodmatch</p>
          <p>A living taste profile for better picks.</p>
        </div>
      </footer>
    </main>
  );
}
