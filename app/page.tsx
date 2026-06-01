export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#1f2428]">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3c6e71]">
          Moodmatch
        </p>
        <section className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            A living taste profile for better movies, books, games, and more.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4f5f63]">
            Moodmatch learns from every favorite, rating, rejection, and saved
            item to build a Taste DNA that improves with each recommendation.
          </p>
        </section>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            "Taste DNA",
            "Perfect Match",
            "Ratings that matter",
          ].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-[#ded6c7] bg-white/70 p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-[#3c6e71]">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
