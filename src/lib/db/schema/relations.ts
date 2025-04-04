// schema/relations.ts
import { relations } from "drizzle-orm";
import { leaderboardEntries } from "./leaderboard-entries";
import { users } from "./users";
import { participants } from "./participants";
import { pools } from "./pools";
import { lobby } from "./lobby";
import { games } from "./games";

export const leaderboardEntriesRelations = relations(
	leaderboardEntries,
	({ one }) => ({
		user: one(users, {
			fields: [leaderboardEntries.userId],
			references: [users.id],
		}),
	})
);

export const participantsRelations = relations(participants, ({ one }) => ({
	user: one(users, {
		fields: [participants.userId],
		references: [users.id],
	}),
	lobby: one(lobby, {
		fields: [participants.lobbyId],
		references: [lobby.id],
	}),
}));

export const lobbyRelations = relations(lobby, ({ one, many }) => ({
	creator: one(users, {
		fields: [lobby.creatorId],
		references: [users.id],
	}),
	game: one(games, {
		fields: [lobby.gameId],
		references: [games.id],
	}),
	pool: one(pools, {
		fields: [lobby.id],
		references: [pools.lobbyId],
	}),
	participants: many(participants),
}));

export const poolsRelations = relations(pools, ({ one }) => ({
	lobby: one(lobby, {
		fields: [pools.lobbyId],
		references: [lobby.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	lobbies: many(lobby),
	participants: many(participants),
}));
