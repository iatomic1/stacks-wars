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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Game } from "@/lib/data/games";

interface CreateLobbyFormProps {
	games: Game[];
	isLoading?: boolean;
}

export default function CreateLobbyForm({
	games,
	isLoading = false,
}: CreateLobbyFormProps) {
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		router.push(`/games/${games[0].id}/play`);
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// Log form data for debugging
		console.log({
			name: formData.get("name"),
			amount: formData.get("amount"),
			maxPlayers: formData.get("maxPlayers"),
			gameId: formData.get("gameId"),
			description: formData.get("description"),
		});

		//// Generate a random lobby ID and redirect
		//const lobbyId = Math.random().toString(36).substring(2, 8);
		//router.push(`/lobby/${lobbyId}`);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Create a Lobby</CardTitle>
				<CardDescription>
					Set up a new lobby and invite friends to join
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-3">
					<div className="space-y-2">
						<Label htmlFor="name">Lobby Name</Label>
						<Input
							id="name"
							name="name"
							placeholder="Enter pool name"
						/>
						<p className="text-sm text-muted-foreground">
							Give your pool a descriptive name
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="amount">Pool Amount (STX)</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
							placeholder="Enter amount in STX"
							defaultValue="100"
						/>
						<p className="text-sm text-muted-foreground">
							This is the initial amount you&apos;ll contribute to
							the pool
						</p>
					</div>

					<div className="space-y-2">
						<Label>
							Maximum Players: <span id="maxPlayersValue">4</span>
						</Label>
						<div className="pt-2">
							<Slider
								name="maxPlayers"
								min={2}
								max={12}
								step={1}
								defaultValue={[4]}
								onValueChange={(values) => {
									const value = values[0];
									document.getElementById(
										"maxPlayersValue"
									)!.textContent = value.toString();
								}}
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							Select the maximum number of players (2-12) that can
							join this pool
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="gameId">Game Type</Label>
						<Select name="gameId" defaultValue={games[0]?.id}>
							<SelectTrigger>
								<SelectValue placeholder="Select a game" />
							</SelectTrigger>
							<SelectContent>
								{games.map((game) => (
									<SelectItem value={game.id} key={game.id}>
										{game.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-sm text-muted-foreground">
							Choose which game will be played in this pool
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							name="description"
							placeholder="Enter pool description"
						/>
						<p className="text-sm text-muted-foreground">
							Provide additional details about your pool
						</p>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" asChild>
						<Link href="/lobby">Cancel</Link>
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && (
							<Loader
								className="h-4 w-4 mr-1 animate-spin"
								size={17}
							/>
						)}
						{isLoading ? "Creating..." : "Create Lobby"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
