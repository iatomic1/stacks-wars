import { sql } from "drizzle-orm";
import { timestamp, uuid, PgColumn } from "drizzle-orm/pg-core";

export const UUID = {
	id: uuid().primaryKey().defaultRandom(),
};

export const TIMESTAMP = {
	createdAt: timestamp({ mode: "string" }).notNull().defaultNow(),
	updatedAt: timestamp({ mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdate(() => sql`now()`),
};

export const createUserIdReference = (users: { id: PgColumn }) => ({
	userId: uuid()
		.notNull()
		.references(() => users.id),
});
