import { decimal, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createUserIdReference, TIMESTAMP, UUID } from "./utils";
import { users } from "./users";
import { lobby } from "./lobby";

export const participants = pgTable("participants", {
  ...createUserIdReference(users),
  ...UUID,
  ...TIMESTAMP,
  lobbyId: uuid().references(() => lobby.id),
  amount: decimal({ precision: 18, scale: 8 }).notNull(),
  txId: text().notNull(),
});
