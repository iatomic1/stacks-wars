"use server";
import { revalidatePath } from "next/cache";
import {
  createPool,
  joinPool,
  getAllPools,
  getPoolById,
  updatePoolStatus,
} from "../services/pools";
import { createServerAction } from "zsa";
import { insertPoolSchema } from "../db/schema/pools";
import { z } from "zod";

export const createPoolAction = createServerAction()
  .input(insertPoolSchema)
  .handler(async ({ input }) => {
    console.log("input received", input);
    try {
      const pool = await createPool(input);
      revalidatePath("/pools");
      return { success: true, data: pool };
    } catch (error) {
      console.error("Error creating pool:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pool",
      };
    }
  });

export const updatePoolStatusAction = createServerAction()
  .input(
    z.object({
      poolId: z.string(),
      status: z.string(),
      initializeTxId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const pool = await updatePoolStatus(
        input.poolId,
        input.status,
        input.initializeTxId,
      );
      revalidatePath("/pools");
      revalidatePath(`/pools/${input.poolId}`);
      return { success: true, data: pool };
    } catch (error) {
      console.error("Error creating pool:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pool",
      };
    }
  });

export const joinPoolAction = createServerAction()
  .input(
    z.object({
      poolId: z.string(),
      userId: z.string(),
      txId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const participant = await joinPool(input);
      revalidatePath(`/pools/${input.poolId}`);
      return { success: true, data: participant };
    } catch (error) {
      console.error("Error creating pool:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to join pool",
      };
    }
  });

export async function getPoolsAction(filters?: {
  gameId?: number;
  status?: string;
}) {
  try {
    const pools = await getAllPools(filters);
    return { success: true, data: pools };
  } catch (error) {
    console.error("Error fetching pools:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch pools",
    };
  }
}

export async function getPoolAction(id: number) {
  try {
    const pool = await getPoolById(id);
    if (!pool) {
      return { success: false, error: "Pool not found" };
    }
    return { success: true, data: pool };
  } catch (error) {
    console.error("Error fetching pool:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch pool",
    };
  }
}
