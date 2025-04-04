import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { games, gameInsertSchema } from "../db/schema/games";
import { ZodError } from "zod";
import { Game as GameType } from "@/types/lobbySchema";

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export class GameServiceError extends Error {
	constructor(message: string, public cause?: unknown) {
		super(message);
		this.name = "GameServiceError";
	}
}

/**
 * Fetch a game by its UUID
 */
export async function getGameById(id: string): Promise<GameType | null> {
	try {
		const result = await db.query.games.findFirst({
			where: eq(games.id, id),
		});
		if (!result) return null;
		return {
			...result,
			tags: JSON.parse(result.tags),
			totalPrize: Number(result.totalPrize),
		};
	} catch (error) {
		throw new GameServiceError(`Failed to get game with ID ${id}`, error);
	}
}

/**
 * Fetch all games
 */
export async function getAllGames(): Promise<GameType[]> {
	try {
		const result = await db.query.games.findMany();
		return result.map((game) => ({
			...game,
			tags: JSON.parse(game.tags),
			totalPrize: Number(game.totalPrize),
		})) as GameType[];
	} catch (error) {
		throw new GameServiceError("Failed to fetch games", error);
	}
}

/**
 * Create a new game
 */
export async function createGame(
	data: Omit<NewGame, "id" | "createdAt" | "updatedAt">
): Promise<Game> {
	try {
		const validatedData = gameInsertSchema.parse({
			...data,
			description: data.description ?? null,
			image: data.image ?? null,
		});

		const result = await db.insert(games).values(validatedData).returning();

		if (!result.length) {
			throw new GameServiceError(
				"Failed to create game: No result returned"
			);
		}

		return result[0];
	} catch (error) {
		if (error instanceof ZodError) {
			throw new GameServiceError(
				`Invalid game data: ${error.errors
					.map((e) => e.message)
					.join(", ")}`,
				error
			);
		}
		throw new GameServiceError("Failed to create game", error);
	}
}

/**
 * Insert initial game data
 */
export async function insertInitialGame() {
	const lexiWar = {
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		tags: JSON.stringify(["Word game", "Strategy"]),
		image: "/lexi-wars.webp",
		activeLobbies: 10,
		totalPrize: "0",
		maxPlayers: 10,
	};

	try {
		const result = await createGame(lexiWar);
		console.log("Lexi War game inserted:", result);
		return result;
	} catch (error) {
		if (
			error instanceof GameServiceError &&
			error.message.includes("duplicate")
		) {
			console.log("Lexi War game already exists");
			return null;
		}
		throw error;
	}
}

//insertInitialGame();
