"use client";
import { useServerAction } from "zsa-react";
import { createLobbyWithPoolAction } from "@/lib/actions/lobby";
import { toast } from "sonner";

export function useCreateLobbyWithPool() {
	const { isPending, execute } = useServerAction(createLobbyWithPoolAction, {
		onSuccess(args) {
			const data = args.data.data;
			if (data) {
				toast.success("Lobby and pool created successfully");
			}
		},
		onError(error) {
			console.error("Error in server action:", error);
			toast.error("Failed to create lobby with pool", {
				description:
					(error.err as Error).message || "An unknown error occurred",
			});
		},
	});

	return {
		isPending,
		execute,
	};
}
