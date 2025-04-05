"use client";
import { useServerAction } from "zsa-react";
import { joinLobbyAction } from "@/lib/actions/lobby";
import { toast } from "sonner";

export function useJoinLobby() {
	const { isPending, execute } = useServerAction(joinLobbyAction, {
		onSuccess(args) {
			const data = args.data.data;
			if (data) {
				console.log("Successfully joined the lobby");
				toast.success("Successfully joined the lobby");
				console.log("Participant data:", data);
			}
		},
		onError(error) {
			console.error("Error joining lobby:", error);
			toast.error("Failed to join lobby", {
				description:
					(error.err as Error).message || "An unknown error occurred",
			});
		},
	});

	return {
		isJoining: isPending,
		joinLobby: execute,
	};
}
