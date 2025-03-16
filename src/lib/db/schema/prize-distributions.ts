//import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
//import { TIMESTAMP, UUID } from "./utils";
//import { pools } from "./pools";

//export const prizeDistributions = pgTable("prize_distributions", {
//  ...UUID,
//  poolId: uuid().references(() => pools.id),
//  position: integer().notNull(),
//  percentage: integer().notNull(),
//  ...TIMESTAMP,
//});
