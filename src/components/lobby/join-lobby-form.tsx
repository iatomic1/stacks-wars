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
import { request } from "@stacks/connect";
import { StxPostCondition } from "@stacks/transactions";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface JoinPoolFormProps {
	amount: number;
	maxPlayers?: number;
	currentPlayers?: number;
	isUserJoined?: boolean;
	isUserConnected?: boolean;
	lobbyId: string;
}

export default function JoinLobbyForm({
	amount,
	maxPlayers = 20,
	currentPlayers = 0,
	isUserJoined = false,
	isUserConnected = true,
	lobbyId,
}: JoinPoolFormProps) {
	//const router = useRouter();
	const isLoading = false;
	const isFull = currentPlayers >= maxPlayers;

	const handleSubmit = async () => {
		console.log("Joining pool with amount:", amount);
		// Here you can add any additional logic needed when joining the pool
		const contract = `ST16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY2M1PXJ7.Flames-stacks-wars`; //replace with actual contract address
		// replace with actual addy and amount
		const stxPostCondition: StxPostCondition = {
			type: "stx-postcondition",
			address: "STF0V8KWBS70F0WDKTMY65B3G591NN52PR4Z71Y3",
			condition: "eq",
			amount: "100",
		};
		await request("stx_callContract", {
			contract,
			functionName: "join-pool",
			functionArgs: [],
			network: "testnet",
			postConditionMode: "deny",
			postConditions: [stxPostCondition],
		}).then((response) => {
			console.log("Get here");
			console.log(response);
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
					<p className="text-2xl font-bold">{amount} STX</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					size="lg"
					disabled={
						isLoading || isFull || isUserJoined || !isUserConnected
					}
					onClick={handleSubmit}
				>
					{isLoading ? (
						<>
							<Loader className="mr-2 h-4 w-4 animate-spin" />
							Joining...
						</>
					) : isUserJoined ? (
						"Already Joined"
					) : !isUserConnected ? (
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
