import { Sparkles } from "lucide-react";

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
      className={`editorial-shadow rounded-xl border border-outline-variant bg-surface-container-low ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-tertiary-fixed">
            <Sparkles size={17} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
              Level {progress.level}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-primary">
              {progress.title}
            </h2>
          </div>
        </div>
        <p className="text-sm font-bold text-primary">{progress.totalXp} XP</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full rounded-full bg-secondary-container"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-on-surface-variant">
        {progress.xpIntoLevel} / {progress.xpForNextLevel} XP to next level
      </p>
    </section>
  );
}
