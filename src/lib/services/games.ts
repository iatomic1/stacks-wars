//import { db } from "@/lib/db";
//import { eq } from "drizzle-orm";
//import { games, gameInsertSchema } from "../db/schema/games";
//import { ZodError } from "zod";

//export type Game = typeof games.$inferSelect;
//export type NewGame = typeof games.$inferInsert;

//export class GameServiceError extends Error {
//  constructor(
//    message: string,
//    public cause?: unknown,
//  ) {
//    super(message);
//    this.name = "GameServiceError";
//  }
//}

///**
// * Fetch a game by its UUID
// */
//export async function getGameById(id: string): Promise<Game | null> {
//  try {
//    const result = await db.query.games.findFirst({
//      where: eq(games.id, id),
//    });
//    return result || null;
//  } catch (error) {
//    throw new GameServiceError(`Failed to get game with ID ${id}`, error);
//  }
//}

///**
// * Fetch all games
// */
//export async function getAllGames(): Promise<Game[]> {
//  try {
//    const result = await db.query.games.findMany();
//    return result;
//  } catch (error) {
//    throw new GameServiceError("Failed to fetch games", error);
//  }
//}

///**
// * Create a new game
// */
//export async function createGame(
//  data: Omit<NewGame, "id" | "createdAt" | "updatedAt">,
//): Promise<Game> {
//  try {
//    const validatedData = gameInsertSchema.parse({
//      ...data,
//      description: data.description ?? null,
//      image: data.image ?? null,
//      difficulty: data.difficulty ?? null,
//    });

//    const result = await db.insert(games).values(validatedData).returning();

//    if (!result.length) {
//      throw new GameServiceError("Failed to create game: No result returned");
//    }

//    return result[0];
//  } catch (error) {
//    if (error instanceof ZodError) {
//      throw new GameServiceError(
//        `Invalid game data: ${error.errors.map((e) => e.message).join(", ")}`,
//        error,
//      );
//    }
//    throw new GameServiceError("Failed to create game", error);
//  }
//}
