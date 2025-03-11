// services/pools.ts
import { db } from "@/lib/db";
import { eq, and, count, sum } from "drizzle-orm";
import { participants } from "../db/schema/participants";
import { pools } from "../db/schema/pools";
import { prizeDistributions } from "../db/schema/prize-distributions";
import { games } from "../db/schema/games";
import { User } from "./users";
import { Game } from "./games";

export type Pool = typeof pools.$inferSelect;
export type NewPool = typeof pools.$inferInsert;
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export type PrizeDistribution = typeof prizeDistributions.$inferInsert;
export type NewPoolWithDistribution = NewPool & {
  prizeDistribution?: PrizeDistribution[];
};

export class PoolServiceError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "PoolServiceError";
  }
}

async function updateGameStats(gameId: string): Promise<void> {
  try {
    const activePools = await db
      .select({ count: count() })
      .from(pools)
      .where(and(eq(pools.gameId, gameId), eq(pools.status, "open")));

    const prizeTotals = await db
      .select({ total: sum(pools.amount) })
      .from(pools)
      .where(eq(pools.gameId, gameId));

    await db
      .update(games)
      .set({
        activePools: Number(activePools[0]?.count || 0),
        totalPrize: prizeTotals[0]?.total?.toString() || "0",
      })
      .where(eq(games.id, gameId));
  } catch (err) {
    throw new PoolServiceError(
      `Failed to update game stats for game ${gameId}`,
      err,
    );
  }
}

async function updatePoolCurrentAmount(poolId: string): Promise<void> {
  try {
    const participantAmounts = await db
      .select({ total: sum(participants.amount) })
      .from(participants)
      .where(eq(participants.poolId, poolId));

    const currentAmount = participantAmounts[0]?.total || "0";

    await db
      .update(pools)
      .set({ currentAmount: currentAmount })
      .where(eq(pools.id, poolId));
  } catch (err) {
    throw new PoolServiceError(
      `Failed to update current amount for pool ${poolId}`,
      err,
    );
  }
}

export async function getPoolById(id: string): Promise<
  | ({
      creator: User;
      game: Game;
      prizeDistribution?: PrizeDistribution[];
      participants: Participant[];
    } & Pool)
  | null
> {
  try {
    const result = await db.query.pools.findFirst({
      where: eq(pools.id, id),
      with: {
        creator: true,
        game: true,
        participants: {
          with: {
            user: true,
          },
        },
        prizeDistributions: true,
      },
    });

    return result || null;
  } catch (err) {
    throw new PoolServiceError(`Failed to get pool with ID ${id}`, err);
  }
}

type AllPools = Pool & {
  creator: User;
  game: Game;
  participants: Participant[];
};

export async function getAllPools(filters?: {
  gameId?: string;
  status?: string;
}): Promise<AllPools[]> {
  try {
    const whereConditions = [];

    if (filters?.gameId) {
      whereConditions.push(eq(pools.gameId, filters.gameId));
    }

    if (filters?.status) {
      whereConditions.push(eq(pools.status, filters.status));
    }

    const result = await db.query.pools.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        creator: true,
        game: true,
        participants: true,
      },
    });

    return result;
  } catch (err) {
    throw new PoolServiceError(`Failure to get all pools`, err);
  }
}

export async function createPool(data: NewPoolWithDistribution): Promise<Pool> {
  try {
    const result = await db.transaction(async (tx) => {
      try {
        const newPool = await tx
          .insert(pools)
          .values({
            ...data,
            currentAmount: "0",
            maxPlayers: Number(data.maxPlayers),
            startTime:
              data.startTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
            description: data.description || "",
            status: "open",
          })
          .returning();

        if (!newPool.length) {
          throw new Error("Failed to create pool: No pool was inserted.");
        }

        const poolId = newPool[0].id;

        // Add prize distribution if provided, otherwise use default
        const distributions = data.prizeDistribution || [
          { position: 1, percentage: 50 },
          { position: 2, percentage: 30 },
          { position: 3, percentage: 20 },
        ];

        if (!distributions.length) {
          throw new Error(
            "Invalid prize distribution: No distributions provided.",
          );
        }

        // Insert prize distributions with proper typing
        await tx.insert(prizeDistributions).values(
          distributions.map((dist: PrizeDistribution) => ({
            poolId,
            position: dist.position,
            percentage: dist.percentage,
          })),
        );

        return newPool[0];
      } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Transaction error: Pool creation failed.");
      }
    });

    if (!result) {
      throw new Error("Pool creation failed: No result returned.");
    }

    if (result.gameId) {
      await updateGameStats(result.gameId);
    }

    return result;
  } catch (error) {
    console.error("Error in createPool:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred.",
    );
  }
}

export async function joinPool(data: {
  poolId: string;
  userId: string;
  txId: string;
}): Promise<Participant> {
  const pool = await getPoolById(data.poolId);

  if (!pool) {
    throw new Error("Pool not found");
  }

  // if (pool.status !== "open") {
  //   throw new Error("Pool is not open for joining");
  // }

  const participantsCount = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.poolId, data.poolId));

  if (participantsCount[0].count >= pool.maxPlayers) {
    await db
      .update(pools)
      .set({ status: "full" })
      .where(eq(pools.id, data.poolId));

    if (pool.gameId) {
      await updateGameStats(pool.gameId);
    }

    throw new Error("Pool is already full");
  }

  const existingParticipant = await db.query.participants.findFirst({
    where: and(
      eq(participants.poolId, data.poolId),
      eq(participants.userId, data.userId),
    ),
  });

  if (existingParticipant) {
    throw new Error("User already joined this pool");
  }

  const entryAmount = (parseFloat(pool.amount) / pool.maxPlayers).toString();

  const newParticipant = await db
    .insert(participants)
    .values({
      userId: data.userId,
      poolId: data.poolId,
      amount: entryAmount,
      txId: data.txId,
    })
    .returning();

  await updatePoolCurrentAmount(data.poolId);

  // Check if pool is now full after adding this participant
  const newParticipantsCount = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.poolId, data.poolId));

  if (newParticipantsCount[0].count >= pool.maxPlayers) {
    await db
      .update(pools)
      .set({ status: "full" })
      .where(eq(pools.id, data.poolId));
  }

  if (pool.gameId) {
    await updateGameStats(pool.gameId);
  }

  return newParticipant[0];
}

export async function updatePoolStatus(
  id: string,
  status: string,
  initializeTxId: string,
): Promise<Pool> {
  try {
    const pool = await getPoolById(id);
    if (!pool) {
      throw new PoolServiceError(`Pool with ID ${id} not found`);
    }

    const updatedPool = await db
      .update(pools)
      .set({ status, initializeTxId: initializeTxId })
      .where(eq(pools.id, id))
      .returning();

    return updatedPool[0];
  } catch (err) {
    throw new PoolServiceError(`Failed to update pool status`, err);
  }
}

export async function deletePool(id: string): Promise<void> {
  try {
    const pool = await getPoolById(id);
    if (!pool) {
      throw new PoolServiceError(`Pool with ID ${id} not found`);
    }

    const gameId = pool.gameId;

    await db.delete(pools).where(eq(pools.id, id));

    if (gameId) {
      await updateGameStats(gameId);
    }
  } catch (err) {
    throw new PoolServiceError(`Failed to delete pool`, err);
  }
}
