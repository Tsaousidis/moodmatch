type UserProgress = {
  totalXp: number;
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
};

export function LevelProgress({
  progress,
  compact = false,
}: {
  progress: UserProgress;
  compact?: boolean;
}) {
  return (
    <section
      className={`rounded-lg border border-[#c8d3cc] bg-[#eaf0eb] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c6e71]">
            Level {progress.level}
          </p>
          <h2 className={`${compact ? "mt-1 text-lg" : "mt-2 text-xl"} font-semibold`}>
            {progress.title}
          </h2>
        </div>
        <p className="text-sm font-semibold text-[#3c6e71]">
          {progress.totalXp} XP
        </p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#3c6e71]"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#4f5f63]">
        {progress.xpIntoLevel} / {progress.xpForNextLevel} XP to next level
      </p>
    </section>
  );
}
