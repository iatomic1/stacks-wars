import { decimal, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createUserIdReference, TIMESTAMP, UUID } from "./utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";
import { lobby } from "./lobby";

export const participants = pgTable("participants", {
	...createUserIdReference(users),
	...UUID,
	...TIMESTAMP,
	lobbyId: uuid()
		.references(() => lobby.id)
		.notNull(),
	stxAddress: text().notNull(),
	username: text().notNull(),
	amount: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
	txId: text().default(""),
});

export const participantSelectSchema = createSelectSchema(participants);
export const participantInsertSchema = createInsertSchema(participants);
