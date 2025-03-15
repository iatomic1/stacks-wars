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
import { Game } from "@/app/games/page";

interface CreateLobbyFormProps {
	games: Game[];
	isLoading?: boolean;
	onSubmit: (values: {
		name: string;
		amount: number;
		maxPlayers: number;
		gameId: string;
		description: string;
	}) => void;
}

export default function CreateLobbyForm({
	games,
	isLoading = false,
	onSubmit,
}: CreateLobbyFormProps) {
	const router = useRouter();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Create a Lobby</CardTitle>
				<CardDescription>
					Set up a new lobby and invite friends to join
				</CardDescription>
			</CardHeader>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const values = {
						name: formData.get("name") as string,
						amount: Number(formData.get("amount")),
						maxPlayers: Number(formData.get("maxPlayers")),
						gameId: formData.get("gameId") as string,
						description: formData.get("description") as string,
					};
					onSubmit(values);
				}}
			>
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
						<Select
							name="gameId"
							defaultValue={games.length > 0 ? games[0].id : ""}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a game" />
							</SelectTrigger>
							<SelectContent>
								{games.map((game, index) => (
									<SelectItem value={game.id} key={index}>
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
					<Button
						onClick={() => {
							router.push(`/lobby/${games[0].id}`);
						}}
						type="submit"
						disabled={isLoading}
					>
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
