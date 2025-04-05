// services/lobby.ts
import { eq } from "drizzle-orm";
import { lobbyInsertSchema, lobby } from "../db/schema/lobby";
import {
	participantInsertSchema,
	participants,
} from "../db/schema/participants";
import { pools } from "../db/schema/pools";
import { db } from "../db";

export type CreateLobbyInput = typeof lobby.$inferInsert;
export type CreatePoolInput = typeof pools.$inferInsert;
export type Lobby = typeof lobby.$inferSelect;

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

export async function getLobbyById(id: string) {
	try {
		const result = await db.query.lobby.findFirst({
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

		if (!result) return undefined;

		return {
			...result,
		};
	} catch (error) {
		console.error("Error getting lobby by ID:", error);
		return undefined;
	}
}

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

export type JoinLobbyInput = {
	userId: string;
	lobbyId: string;
	stxAddress: string;
	username: string;
	amount?: number;
};

export const joinLobby = async (input: JoinLobbyInput) => {
	const currentLobby = await getLobbyById(input.lobbyId);

	if (!currentLobby) {
		throw new Error("Lobby not found");
	}

	// if (currentLobby.status !== "pending" && currentLobby.status !== "open") {
	//   throw new Error(`Cannot join lobby with status: ${currentLobby.status}`);
	// }

	//if (currentLobby.participants.length >= currentLobby.maxPlayers) {
	//	throw new Error("Lobby is full");
	//}

	const existingParticipant = currentLobby.participants.find(
		(p) => p.userId === input.userId
	);

	if (existingParticipant) {
		throw new Error("User already joined this lobby");
	}

	const participantData = {
		userId: input.userId,
		lobbyId: input.lobbyId,
		stxAddress: input.stxAddress,
		username: input.username,
		amount: "0",
	};

	const validatedInput = participantInsertSchema.parse(participantData);

	return await db.transaction(async (tx) => {
		const [newParticipant] = await tx
			.insert(participants)
			.values(validatedInput)
			.returning();

		if (currentLobby.pool && input.amount) {
			await tx
				.update(pools)
				.set({
					currentAmount: (
						Number(currentLobby.pool.currentAmount) +
						Number(input.amount)
					).toString(),
				})
				.where(eq(pools.lobbyId, input.lobbyId));
		}

		// If the lobby was pending and now has enough players, change the status to open
		if (
			currentLobby.status === "pending" &&
			currentLobby.participants.length + 1 >= 2 // Assuming minimum players is 2
		) {
			await tx
				.update(lobby)
				.set({ status: "open" })
				.where(eq(lobby.id, input.lobbyId));
		}

		return {
			...newParticipant,
		};
	});
};
