import { decimal, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createUserIdReference, UUID } from "./utils";
import { users } from "./users";

export const leaderboardEntries = pgTable("leaderboard_entries", {
  ...UUID,
  ...createUserIdReference(users),
  wins: integer().default(0),
  earnings: decimal().default("0"),
  weeklyWins: integer().default(0),
  weeklyEarnings: decimal().default("0"),
  updatedAt: timestamp().defaultNow(),
});
