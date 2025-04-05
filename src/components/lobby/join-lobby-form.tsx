"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { useJoinLobby } from "@/hooks/useJoinLobby";
import { LobbySchema } from "@/types/lobbySchema";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { isConnected } from "@stacks/connect";
import { joinGamePool } from "@/lib/actions/join-game-pool";

interface JoinPoolFormProps {
	lobby: LobbySchema;
}

export default function JoinLobbyForm({ lobby }: JoinPoolFormProps) {
	const isLoading = false;
	const { isJoining, joinLobby } = useJoinLobby();
	const { user } = useUser();
	const isFull = lobby.participants.length >= lobby.game.maxPlayers;

	const handleSubmit = async () => {
		if (!user) {
			toast.info("you need to be logged in");
			return;
		}
		const isUserJoined = lobby.participants.some(
			(p) => p.userId === user.id
		);

		if (isUserJoined) {
			toast.info("you have already joined this lobby");
			return;
		}

		console.log(
			`Joining lobby ${lobby.id} with amount:`,
			lobby.pool.entryAmount
		);
		// Here you can add any additional logic needed when joining the pool

		if (lobby.pool && lobby.pool.contract) {
			const response = await joinGamePool(
				lobby.pool.contract,
				user.stxAddress,
				Number(lobby.pool.entryAmount)
			);
			console.log("response", response.txid);
		}
		await joinLobby({
			userId: user.id,
			lobbyId: lobby.id,
			stxAddress: user?.stxAddress,
			username: user.stxAddress,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Join Lobby</CardTitle>
				<CardDescription>
					Join this lobby to participate in the game
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<p className="text-sm font-medium mb-1">Entry Fee</p>
					<p className="text-2xl font-bold">
						{lobby.pool.entryAmount} STX
					</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					size="lg"
					disabled={
						isLoading || isJoining || isFull || !isConnected()
					}
					onClick={handleSubmit}
				>
					{isLoading || isJoining ? (
						<>
							<Loader className="mr-2 h-4 w-4 animate-spin" />
							Joining...
						</>
					) : !isConnected() ? (
						"Connect Wallet to Join"
					) : isFull ? (
						"Pool is Full"
					) : (
						"Join Lobby"
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
