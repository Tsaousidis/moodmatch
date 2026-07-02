import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  primaryKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const itemTypeEnum = pgEnum("item_type", [
  "movie",
  "tv_show",
  "book",
  "board_game",
  "video_game",
]);

export const ratingSentimentEnum = pgEnum("rating_sentiment", [
  "loved",
  "liked",
  "mixed",
  "disliked",
  "rejected",
]);

export const questStatusEnum = pgEnum("quest_status", [
  "available",
  "active",
  "completed",
  "claimed",
  "expired",
]);

export const xpActionEnum = pgEnum("xp_action", [
  "signup",
  "complete_onboarding",
  "rate_item",
  "save_item",
  "reject_item",
  "complete_quest",
  "taste_dna_update",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  itemType: itemTypeEnum("item_type").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userCategories = pgTable(
  "user_categories",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.categoryId] })]
);

export const items = pgTable(
  "items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    type: itemTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }),
    description: text("description"),
    releaseYear: integer("release_year"),
    imageUrl: text("image_url"),
    externalId: varchar("external_id", { length: 255 }),
    externalSource: varchar("external_source", { length: 80 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("items_seed_identity_idx").on(
      table.categoryId,
      table.title,
      table.externalSource
    ),
  ]
);

export const userFavorites = pgTable(
  "user_favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.itemId] })]
);

export const userAlreadyExperienced = pgTable(
  "user_already_experienced",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    experiencedAt: timestamp("experienced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.itemId] })]
);

export const ratings = pgTable("ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  itemId: uuid("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  rating: integer("rating"),
  sentiment: ratingSentimentEnum("sentiment"),
  feedback: text("feedback"),
  likedTraits: jsonb("liked_traits").$type<string[]>().default([]),
  dislikedTraits: jsonb("disliked_traits").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tasteDna = pgTable("taste_dna", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  version: integer("version").default(1).notNull(),
  traits: jsonb("traits").$type<Record<string, unknown>>().notNull(),
  summary: text("summary"),
  generatedBy: varchar("generated_by", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tasteTags = pgTable("taste_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  label: varchar("label", { length: 120 }).notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 2 }),
  isConfirmed: boolean("is_confirmed").default(false).notNull(),
  isRejected: boolean("is_rejected").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contentComfortSettings = pgTable("content_comfort_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  avoidSpoilers: boolean("avoid_spoilers").default(true).notNull(),
  avoidExplicitContent: boolean("avoid_explicit_content")
    .default(false)
    .notNull(),
  avoidViolence: boolean("avoid_violence").default(false).notNull(),
  avoidHorror: boolean("avoid_horror").default(false).notNull(),
  avoidSadEndings: boolean("avoid_sad_endings").default(false).notNull(),
  customAvoidList: jsonb("custom_avoid_list").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userSliderDefaults = pgTable("user_slider_defaults", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
  novelty: integer("novelty").default(50).notNull(),
  comfort: integer("comfort").default(50).notNull(),
  depth: integer("depth").default(50).notNull(),
  energy: integer("energy").default(50).notNull(),
  weirdness: integer("weirdness").default(50).notNull(),
  social: integer("social").default(50).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const savedItems = pgTable(
  "saved_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    moodTags: jsonb("mood_tags").$type<string[]>().default([]),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.itemId] })]
);

export const quests = pgTable("quests", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  targetAction: xpActionEnum("target_action").notNull(),
  targetCount: integer("target_count").default(1).notNull(),
  xpReward: integer("xp_reward").default(0).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userQuests = pgTable("user_quests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questId: uuid("quest_id")
    .notNull()
    .references(() => quests.id, { onDelete: "cascade" }),
  status: questStatusEnum("status").default("available").notNull(),
  progress: integer("progress").default(0).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const xpLog = pgTable("xp_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: xpActionEnum("action").notNull(),
  points: integer("points").notNull(),
  itemId: uuid("item_id").references(() => items.id, { onDelete: "set null" }),
  questId: uuid("quest_id").references(() => quests.id, {
    onDelete: "set null",
  }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
export type TasteDna = typeof tasteDna.$inferSelect;
export type Quest = typeof quests.$inferSelect;
