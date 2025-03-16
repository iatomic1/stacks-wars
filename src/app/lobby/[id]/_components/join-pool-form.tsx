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
import { Loader } from "lucide-react";
//import { useRouter } from "next/navigation";

interface JoinPoolFormProps {
	amount: number;
	maxPlayers?: number;
	currentPlayers?: number;
	isUserJoined?: boolean;
	isUserConnected?: boolean;
}

export default function JoinPoolForm({
	amount,
	maxPlayers = 20,
	currentPlayers = 0,
	isUserJoined = false,
	isUserConnected = true,
}: JoinPoolFormProps) {
	//const router = useRouter();
	const isLoading = false;
	const isFull = currentPlayers >= maxPlayers;

	const handleSubmit = () => {
		console.log("Joining pool...");
		// Here you can add any additional logic needed when joining the pool
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Join Pool</CardTitle>
				<CardDescription>
					Join this pool to participate in the game
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<p className="text-sm font-medium mb-1">Entry Fee</p>
						<p className="text-2xl font-bold">{amount} STX</p>
					</div>
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
						"Join Pool"
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
