import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { createInsertSchema } from "drizzle-zod";
import { lobby } from "./lobby";

export const pools = pgTable("pools", {
  ...UUID,
  ...TIMESTAMP,
  lobbyId: uuid()
    .references(() => lobby.id)
    .notNull()
    .unique(),
  currentAmount: decimal().default("0"),
  amount: decimal().notNull(),
  maxPlayers: integer().notNull(),
  contractId: text(),
  deployContractTxId: text().notNull(),
});

export const insertPoolSchema = createInsertSchema(pools);
