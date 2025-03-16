//import { sql } from "drizzle-orm";
//import { timestamp, uuid } from "drizzle-orm/pg-core";
//import { users } from "./users";

//export const UUID = {
//	id: uuid().primaryKey().defaultRandom(),
//};

//export const TIMESTAMP = {
//	createdAt: timestamp({ mode: "string" }).notNull().defaultNow(),
//	updatedAt: timestamp({ mode: "string" })
//		.notNull()
//		.defaultNow()
//		.$onUpdate(() => sql`now()`),
//};

//export const createUserIdReference = (users: any) => ({
//	userId: uuid()
//		.notNull()
//		.references(() => users.id),
//});
