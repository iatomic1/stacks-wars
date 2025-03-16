//import {
//  decimal,
//  integer,
//  pgTable,
//  text,
//  timestamp,
//  uuid,
//  varchar,
//} from "drizzle-orm/pg-core";
//import { TIMESTAMP, UUID } from "./utils";
//import { games } from "./games";
//import { users } from "./users";
//import { createInsertSchema } from "drizzle-zod";

//export const pools = pgTable("pools", {
//  ...UUID,
//  ...TIMESTAMP,
//  name: varchar().notNull(),
//  creatorId: uuid().references(() => users.id),
//  gameId: uuid().references(() => games.id),
//  currentAmount: decimal().default("0"),
//  amount: decimal().notNull(),
//  maxPlayers: integer().notNull(),
//  contractId: text(),
//  deployTxId: text().notNull(),
//  initializeTxId: text(),
//  status: varchar().default("deploying"),
//  startTime: timestamp().notNull(),
//  description: text().notNull(),
//});
//export const insertPoolSchema = createInsertSchema(pools);
