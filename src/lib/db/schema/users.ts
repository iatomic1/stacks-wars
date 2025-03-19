import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";

export const users = pgTable("users", {
  ...UUID,
  username: varchar({ length: 60 }).notNull(),
  stxAddress: varchar().unique().notNull(),
  image: text(),
  ...TIMESTAMP,
});
