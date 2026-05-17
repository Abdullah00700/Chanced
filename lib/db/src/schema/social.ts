import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const friendsTable = pgTable("friends", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  friendUsername: text("friend_username").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const giftsTable = pgTable("gifts", {
  id: serial("id").primaryKey(),
  fromUsername: text("from_username").notNull(),
  toUsername: text("to_username").notNull(),
  type: text("type").notNull(),
  petId: text("pet_id"),
  coinsAmount: integer("coins_amount"),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  claimedAt: timestamp("claimed_at"),
});

export type FriendRow = typeof friendsTable.$inferSelect;
export type GiftRow = typeof giftsTable.$inferSelect;
