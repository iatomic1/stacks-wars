import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/users";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export async function getUserByStxAddress(
	stxAddress: string
): Promise<User | null> {
	const result = await db.query.users.findFirst({
		where: eq(users.stxAddress, stxAddress),
	});

	return result || null;
}

export async function getStxAddressByUserId(
	userId: string
): Promise<string | null> {
	const result = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			stxAddress: true,
		},
	});

	return result?.stxAddress || null;
}

export async function getAllUsers(): Promise<User[]> {
	const result = await db.query.users.findMany();
	return result;
}

export async function createUser(data: NewUser): Promise<User> {
	const existingUser = await getUserByStxAddress(data.stxAddress);

	if (existingUser) {
		return existingUser;
	}

	const result = await db
		.insert(users)
		.values({
			stxAddress: data.stxAddress,
			username: data.username,
			image: data.image || null,
		})
		.returning();

	return result[0];
}
