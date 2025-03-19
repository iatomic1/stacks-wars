import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { users } from "./users";
import { games } from "./games";
import { createInsertSchema } from "drizzle-zod";

export const lobby = pgTable("lobby", {
  ...UUID,
  ...TIMESTAMP,
  name: varchar().notNull(),
  creatorId: uuid().references(() => users.id),
  gameId: uuid()
    .references(() => games.id)
    .notNull(),
  maxPlayers: integer().notNull(),
  status: varchar().default("created"),
  description: text().notNull(),
});

export const insertLobbySchema = createInsertSchema(lobby);
