//import { relations } from "drizzle-orm";
//import { leaderboardEntries } from "./leaderboard-entries";
//import { users } from "./users";
//import { participants } from "./participants";
//import { pools } from "./pools";
//import { games } from "./games";
//import { prizeDistributions } from "./prize-distributions";

//export const leaderboardEntriesRelations = relations(
//  leaderboardEntries,
//  ({ one }) => ({
//    user: one(users, {
//      fields: [leaderboardEntries.userId],
//      references: [users.id],
//    }),
//  }),
//);

//export const participantsRelations = relations(participants, ({ one }) => ({
//  user: one(users, {
//    fields: [participants.userId],
//    references: [users.id],
//  }),
//  pool: one(pools, {
//    fields: [participants.poolId],
//    references: [pools.id],
//  }),
//}));

//export const poolsRelations = relations(pools, ({ one, many }) => ({
//  creator: one(users, {
//    fields: [pools.creatorId],
//    references: [users.id],
//  }),
//  game: one(games, {
//    fields: [pools.gameId],
//    references: [games.id],
//  }),
//  participants: many(participants),
//  prizeDistributions: many(prizeDistributions),
//}));

//export const prizeDistributionsRelations = relations(
//  prizeDistributions,
//  ({ one }) => ({
//    pool: one(pools, {
//      fields: [prizeDistributions.poolId],
//      references: [pools.id],
//    }),
//  }),
//);

//export const usersRelations = relations(users, ({ many }) => ({
//  pools: many(pools),
//  participants: many(participants),
//}));
