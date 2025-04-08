import { eq } from "drizzle-orm";
import { participants } from "../db/schema/participants";
import { db } from "../db";

export async function getLobbyParticipants(lobbyId: string) {
	try {
		const result = await db.query.participants.findMany({
			where: eq(participants.lobbyId, lobbyId),
			with: {
				user: true,
			},
		});

		return result;
	} catch (error) {
		console.error("Error getting lobby participants:", error);
		return [];
	}
}
