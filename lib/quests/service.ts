import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categories,
  quests,
  userCategories,
  userQuests,
  xpLog,
} from "@/lib/db/schema";

const questTemplates = [
  {
    title: "Rate your first three picks",
    description: "Give three recommendations a star rating to sharpen Taste DNA.",
    targetAction: "rate_item",
    targetCount: 3,
    xpReward: 40,
  },
  {
    title: "Grow your Taste DNA",
    description: "Trigger three Taste DNA updates through meaningful feedback.",
    targetAction: "taste_dna_update",
    targetCount: 3,
    xpReward: 35,
  },
] as const;

type QuestStatus = "available" | "active" | "completed" | "claimed" | "expired";

export async function getUserQuests(userId: string) {
  await ensureUserQuests(userId);

  const assignedQuests = await db
    .select({
      userQuestId: userQuests.id,
      status: userQuests.status,
      storedProgress: userQuests.progress,
      title: quests.title,
      description: quests.description,
      targetAction: quests.targetAction,
      targetCount: quests.targetCount,
      xpReward: quests.xpReward,
      categoryName: categories.name,
    })
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .leftJoin(categories, eq(quests.categoryId, categories.id))
    .where(eq(userQuests.userId, userId))
    .orderBy(asc(userQuests.createdAt));

  const actionCounts = await db
    .select({
      action: xpLog.action,
      count: sql<number>`count(*)`,
    })
    .from(xpLog)
    .where(eq(xpLog.userId, userId))
    .groupBy(xpLog.action);
  const countByAction = new Map(
    actionCounts.map((row) => [row.action, Number(row.count)])
  );

  return Promise.all(
    assignedQuests.map(async (quest) => {
      const progress = Math.min(
        quest.targetCount,
        countByAction.get(quest.targetAction) ?? 0
      );
      const isComplete = progress >= quest.targetCount;
      const nextStatus: QuestStatus =
        quest.status === "claimed"
          ? "claimed"
          : isComplete
            ? "completed"
            : progress > 0
              ? "active"
              : "available";

      if (progress !== quest.storedProgress || nextStatus !== quest.status) {
        await db
          .update(userQuests)
          .set({
            progress,
            status: nextStatus,
            startedAt: progress > 0 ? new Date() : null,
            completedAt: isComplete ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(userQuests.id, quest.userQuestId));
      }

      return {
        ...quest,
        progress,
        status: nextStatus,
      };
    })
  );
}

export async function claimQuest(userId: string, userQuestId: string) {
  const [quest] = await db
    .select({
      userQuestId: userQuests.id,
      status: userQuests.status,
      progress: userQuests.progress,
      questId: quests.id,
      targetCount: quests.targetCount,
      xpReward: quests.xpReward,
    })
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .where(
      and(eq(userQuests.id, userQuestId), eq(userQuests.userId, userId))
    )
    .limit(1);

  if (!quest || quest.status !== "completed" || quest.progress < quest.targetCount) {
    throw new Error("Quest is not ready to claim.");
  }

  await db
    .update(userQuests)
    .set({
      status: "claimed",
      claimedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userQuests.id, quest.userQuestId));

  await db.insert(xpLog).values({
    userId,
    questId: quest.questId,
    action: "complete_quest",
    points: quest.xpReward,
  });

  return { xpAwarded: quest.xpReward };
}

async function ensureUserQuests(userId: string) {
  const selectedCategories = await db
    .select({ id: categories.id, name: categories.name })
    .from(userCategories)
    .innerJoin(categories, eq(userCategories.categoryId, categories.id))
    .where(eq(userCategories.userId, userId))
    .limit(1);
  const category = selectedCategories[0];
  const categoryQuest = category
    ? {
        title: `Explore more ${category.name}`,
        description: `Rate two ${category.name.toLowerCase()} picks to reveal stronger category signals.`,
        targetAction: "rate_item" as const,
        targetCount: 2,
        xpReward: 30,
        categoryId: category.id,
      }
    : null;
  const templates = categoryQuest
    ? [...questTemplates, categoryQuest]
    : [...questTemplates];

  const existingQuests = await db
    .select({ title: quests.title })
    .from(quests)
    .where(inArray(quests.title, templates.map((template) => template.title)));
  const existingTitles = new Set(existingQuests.map((quest) => quest.title));

  for (const template of templates) {
    if (!existingTitles.has(template.title)) {
      await db.insert(quests).values(template);
    }
  }

  const availableQuests = await db
    .select({ id: quests.id })
    .from(quests)
    .where(inArray(quests.title, templates.map((template) => template.title)));
  const assignedRows = await db
    .select({ questId: userQuests.questId })
    .from(userQuests)
    .where(eq(userQuests.userId, userId));
  const assignedIds = new Set(assignedRows.map((row) => row.questId));
  const unassigned = availableQuests.filter((quest) => !assignedIds.has(quest.id));

  if (unassigned.length > 0) {
    await db.insert(userQuests).values(
      unassigned.map((quest) => ({
        userId,
        questId: quest.id,
      }))
    );
  }
}
