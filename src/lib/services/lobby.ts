import { eq } from "drizzle-orm";
import { lobbyInsertSchema, lobby } from "../db/schema/lobby";
import { participants } from "../db/schema/participants";
import { pools } from "../db/schema/pools";
import { db } from "../db";

export type CreateLobbyInput = typeof lobby.$inferInsert;
export type CreatePoolInput = typeof pools.$inferInsert;

export const createLobby = async (input: CreateLobbyInput) => {
	const validatedInput = lobbyInsertSchema.parse(input);

	return await db.transaction(async (tx) => {
		const [newLobby] = await tx
			.insert(lobby)
			.values(validatedInput)
			.returning();

		return newLobby;
	});
};

export const createLobbyWithPool = async (
	lobbyInput: CreateLobbyInput,
	poolInput: CreatePoolInput
) => {
	const validatedInput = lobbyInsertSchema.parse(lobbyInput);

	return await db.transaction(async (tx) => {
		const [newLobby] = await tx
			.insert(lobby)
			.values(validatedInput)
			.returning();

		const [newPool] = await tx
			.insert(pools)
			.values({
				...poolInput,
				lobbyId: newLobby.id,
			})
			.returning();

		return {
			lobby: newLobby,
			pool: newPool,
		};
	});
};

export const getLobbyById = async (id: string) => {
	return await db.query.lobby.findFirst({
		where: eq(lobby.id, id),
		with: {
			creator: true,
			game: true,
			pool: true,
			participants: {
				with: {
					user: true,
				},
			},
		},
	});
};

export const updateLobbyStatus = async (lobbyId: string, status: string) => {
	const [updatedLobby] = await db
		.update(lobby)
		.set({ status })
		.where(eq(lobby.id, lobbyId))
		.returning();

	return updatedLobby;
};

export const deleteLobby = async (lobbyId: string) => {
	await db.delete(participants).where(eq(participants.lobbyId, lobbyId));
	await db.delete(pools).where(eq(pools.lobbyId, lobbyId));

	const [deletedLobby] = await db
		.delete(lobby)
		.where(eq(lobby.id, lobbyId))
		.returning();

	return deletedLobby;
};

export const getLobbiesByCreator = async (creatorId: string) => {
	return await db.query.lobby.findMany({
		where: eq(lobby.creatorId, creatorId),
		with: {
			game: true,
			pool: true,
			participants: { with: { user: true } },
		},
	});
};

export const getAvailableLobbies = async () => {
	return await db.query.lobby.findMany({
		// where: eq(lobby.status, "created"),
		with: {
			game: true,
			creator: true,
			pool: true,
			participants: { with: { user: true } },
		},
	});
};

export const getLobbies = async () => {
	return await db.select().from(lobby);
};
