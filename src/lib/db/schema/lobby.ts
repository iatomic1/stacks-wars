import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { users } from "./users";
import { games } from "./games";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const lobby = pgTable("lobby", {
	...UUID,
	...TIMESTAMP,
	name: varchar({ length: 255 }).notNull(),
	creatorId: uuid()
		.references(() => users.id)
		.notNull(),
	gameId: uuid()
		.references(() => games.id)
		.notNull(),
	status: varchar({ length: 50 }).notNull().default("pending"),
	description: text(),
});

export const lobbySelectSchema = createSelectSchema(lobby);
export const lobbyInsertSchema = createInsertSchema(lobby);
