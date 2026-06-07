import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { xpLog } from "@/lib/db/schema";

export async function getUserProgress(userId: string) {
  const [[totalRow], recentActivity] = await Promise.all([
    db
      .select({ totalXp: sql<number>`coalesce(sum(${xpLog.points}), 0)` })
      .from(xpLog)
      .where(eq(xpLog.userId, userId)),
    db
      .select({
        id: xpLog.id,
        action: xpLog.action,
        points: xpLog.points,
        createdAt: xpLog.createdAt,
      })
      .from(xpLog)
      .where(eq(xpLog.userId, userId))
      .orderBy(desc(xpLog.createdAt))
      .limit(5),
  ]);

  const totalXp = Number(totalRow?.totalXp ?? 0);
  const level = calculateLevel(totalXp);
  const currentLevelXp = xpRequiredBeforeLevel(level);
  const nextLevelXp = xpRequiredBeforeLevel(level + 1);
  const xpIntoLevel = totalXp - currentLevelXp;
  const xpForNextLevel = nextLevelXp - currentLevelXp;

  return {
    totalXp,
    level,
    title: getLevelTitle(level),
    xpIntoLevel,
    xpForNextLevel,
    progressPercent: Math.min(
      100,
      Math.round((xpIntoLevel / xpForNextLevel) * 100)
    ),
    recentActivity,
  };
}

export function calculateLevel(totalXp: number) {
  let level = 1;

  while (totalXp >= xpRequiredBeforeLevel(level + 1)) {
    level += 1;
  }

  return level;
}

function xpRequiredBeforeLevel(level: number) {
  return 50 * (level - 1) * level;
}

function getLevelTitle(level: number) {
  if (level >= 10) return "Taste Architect";
  if (level >= 7) return "Signal Reader";
  if (level >= 4) return "Taste Explorer";
  if (level >= 2) return "Curious Matcher";
  return "New Listener";
}
