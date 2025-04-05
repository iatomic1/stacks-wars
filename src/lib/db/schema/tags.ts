import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { TIMESTAMP, UUID } from "./utils";
import { games } from "./games";

export const tags = pgTable("tags", {
	...UUID,
	...TIMESTAMP,
	name: varchar({ length: 50 }).notNull().unique(),
	gameId: uuid()
		.notNull()
		.references(() => games.id),
});
