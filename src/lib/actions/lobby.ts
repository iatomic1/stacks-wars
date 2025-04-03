"use server";
import { revalidatePath } from "next/cache";
import { createServerAction } from "zsa";
import { lobbyInsertSchema } from "../db/schema/lobby";
import { createLobby, createLobbyWithPool, joinLobby } from "../services/lobby";
import { poolInsertSchema } from "../db/schema/pools";
import { z } from "zod";
const joinLobbySchema = z.object({
  userId: z.string().uuid(),
  lobbyId: z.string().uuid(),
  stxAddress: z.string().min(1, "STX address is required"),
  username: z.string().min(1, "Username is required"),
  amount: z.number().optional().default(0),
});

const leaveLobbySchema = z.object({
  userId: z.string().uuid(),
  lobbyId: z.string().uuid(),
});

export const createLobbyAction = createServerAction()
  .input(lobbyInsertSchema)
  .handler(async ({ input }) => {
    console.log("input received", input);
    try {
      const lobby = await createLobby(input);
      revalidatePath("/lobby");
      return { success: true, data: lobby };
    } catch (error) {
      console.error("Error creating lobby:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create lobby",
      };
    }
  });

export const createLobbyWithPoolAction = createServerAction()
  .input(
    z.object({
      lobby: lobbyInsertSchema,
      pool: poolInsertSchema,
    }),
  )
  .handler(async ({ input }) => {
    console.log("input received", input);
    try {
      const data = await createLobbyWithPool(input.lobby, input.pool);
      revalidatePath("/lobby");
      return {
        success: true,
        data: {
          ...data,
        },
      };
    } catch (error) {
      console.error("Error creating pool:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pool",
      };
    }
  });

export const joinLobbyAction = createServerAction()
  .input(joinLobbySchema)
  .handler(async ({ input }) => {
    console.log("Join lobby input received:", input);
    try {
      const participant = await joinLobby(input);
      revalidatePath(`/lobby/${input.lobbyId}`);
      revalidatePath("/lobby");

      return {
        success: true,
        data: participant,
      };
    } catch (error) {
      console.error("Error joining lobby:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to join lobby",
      };
    }
  });

// export const updatePoolStatusAction = createServerAction()
//  .input(
//    z.object({
//      poolId: z.string(),
//      status: z.string(),
//      initializeTxId: z.string(),
//    }),
//  )
//  .handler(async ({ input }) => {
//    try {
//      const pool = await updatePoolStatus(
//        input.poolId,
//        input.status,
//        input.initializeTxId,
//      );
//      revalidatePath("/pools");
//      revalidatePath(`/pools/${input.poolId}`);
//      return { success: true, data: pool };
//    } catch (error) {
//      console.error("Error creating pool:", error);
//      return {
//        success: false,
//        error: error instanceof Error ? error.message : "Failed to create pool",
//      };
//    }
//  });
//
// export const joinPoolAction = createServerAction()
//  .input(
//    z.object({
//      poolId: z.string(),
//      userId: z.string(),
//      txId: z.string(),
//    }),
//  )
//  .handler(async ({ input }) => {
//    try {
//      const participant = await joinPool(input);
//      revalidatePath(`/pools/${input.poolId}`);
//      return { success: true, data: participant };
//    } catch (error) {
//      console.error("Error creating pool:", error);
//      return {
//        success: false,
//        error: error instanceof Error ? error.message : "Failed to join pool",
//      };
//    }
//  });
//
// export async function getPoolsAction(filters?: {
//  gameId?: number;
//  status?: string;
// }) {
//  try {
//    const pools = await getAllPools(filters);
//    return { success: true, data: pools };
//  } catch (error) {
//    console.error("Error fetching pools:", error);
//    return {
//      success: false,
//      error: error instanceof Error ? error.message : "Failed to fetch pools",
//    };
//  }
// }
//
// export async function getPoolAction(id: number) {
//  try {
//    const pool = await getPoolById(id);
//    if (!pool) {
//      return { success: false, error: "Pool not found" };
//    }
//    return { success: true, data: pool };
//  } catch (error) {
//    console.error("Error fetching pool:", error);
//    return {
//      success: false,
//      error: error instanceof Error ? error.message : "Failed to fetch pool",
//    };
//  }
// }
