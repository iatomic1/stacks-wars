import { NextResponse } from "next/server";
import { getLobbyParticipants } from "@/lib/services/participants";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}

		const participants = await getLobbyParticipants(await params.id);
		const isParticipant = participants.some((p) => p.userId === userId);

		return NextResponse.json({ isParticipant });
	} catch (error) {
		console.error("Error checking participant:", error);
		return NextResponse.json(
			{ error: "Failed to check participant" },
			{ status: 500 }
		);
	}
}
