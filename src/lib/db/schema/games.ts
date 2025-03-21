import { decimal, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const games = pgTable("games", {
	...UUID,
	...TIMESTAMP,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	tags: text("tags").array().notNull(),
	image: text(),
	activeLobbies: integer().notNull().default(0),
	totalPrize: decimal("totalPrize", { precision: 10, scale: 2 })
		.notNull()
		.default("0"),
});

export const gameSelectSchema = createSelectSchema(games);
export const gameInsertSchema = createInsertSchema(games);
