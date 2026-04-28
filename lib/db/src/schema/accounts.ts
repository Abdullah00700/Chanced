import {
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const accountsTable = pgTable("accounts", {
  username: text("username").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  profile: jsonb("profile").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export type AccountRow = typeof accountsTable.$inferSelect;

export const leaderboardTable = pgTable("leaderboard", {
  username: text("username").primaryKey(),
  displayName: text("display_name").notNull(),
  number: integer("number").notNull(),
  prob: doublePrecision("prob").notNull(),
  rarity: text("rarity").notNull(),
  level: integer("level").notNull(),
  ts: timestamp("ts", { withTimezone: false }).notNull().defaultNow(),
});

export type LeaderboardRow = typeof leaderboardTable.$inferSelect;
