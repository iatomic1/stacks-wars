import { decimal, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const games = pgTable("games", {
  ...UUID,
  ...TIMESTAMP,
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  image: text(),
  difficulty: varchar("difficulty", { length: 50 }),
  activePools: integer().notNull().default(0),
  totalPrize: decimal().notNull().default("0"),
});

export const gameSelectSchema = createSelectSchema(games);
export const gameInsertSchema = createInsertSchema(games);
