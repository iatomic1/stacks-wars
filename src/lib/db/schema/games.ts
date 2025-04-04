import { decimal, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const games = pgTable("games", {
	...UUID,
	...TIMESTAMP,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	tags: text().notNull().default("[]"),
	image: text(),
	activeLobbies: integer().notNull().default(0),
	totalPrize: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
	maxPlayers: integer().notNull().default(1),
});

export const gameSelectSchema = createSelectSchema(games);
export const gameInsertSchema = createInsertSchema(games);
