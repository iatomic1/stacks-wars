import { decimal, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { lobby } from "./lobby";

export const pools = pgTable("pools", {
	...UUID,
	...TIMESTAMP,
	lobbyId: uuid()
		.references(() => lobby.id)
		.notNull()
		.unique(),
	currentAmount: decimal({ precision: 10, scale: 2 }).notNull().default("0"),
	entryAmount: decimal({ precision: 10, scale: 2 }).notNull(),
	contract: text(),
	deployContractTxId: text().notNull(),
});

export const poolSelectSchema = createSelectSchema(pools);
export const poolInsertSchema = createInsertSchema(pools);
