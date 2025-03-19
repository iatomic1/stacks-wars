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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Game } from "@/lib/data/games";
import { toast } from "sonner";
//import { useState } from "react";

interface CreateLobbyFormProps {
	games: Game[];
	isLoading?: boolean;
}

export default function CreateLobbyForm({
	games,
	isLoading = false,
}: CreateLobbyFormProps) {
	//const [withPool, setWithPool] = useState(false);
	const withPool = false;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast.info("Lobby creation is coming soon!", {
			position: "bottom-right",
		});
		console.log(games[0]);
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
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="inline-flex items-center gap-1"
						>
							Lobby Name
							<span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							name="name"
							placeholder="Enter lobby name"
							required
						/>
						<p className="text-sm text-muted-foreground">
							Give your lobby a descriptive name
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							name="description"
							placeholder="Enter lobby description"
						/>
						<p className="text-sm text-muted-foreground">
							Provide additional details about your lobby
						</p>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="pool-mode"
							checked={withPool}
							onCheckedChange={() => {
								toast.info(
									"Lobby creation with pool is coming soon!",
									{
										position: "bottom-right",
									}
								);
							}}
						/>
						<Label htmlFor="pool-mode">
							Create lobby with pool
						</Label>
					</div>

					{withPool && (
						<div className="space-y-2">
							<Label
								htmlFor="amount"
								className="inline-flex items-center gap-1"
							>
								Pool Amount (STX)
								<span className="text-destructive">*</span>
							</Label>
							<Input
								id="amount"
								name="amount"
								type="number"
								placeholder="Enter amount in STX"
								defaultValue="100"
								required={withPool}
								min="1"
							/>
							<p className="text-sm text-muted-foreground">
								This is the initial amount you&apos;ll
								contribute to the pool and entry fee for other
								players
							</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" asChild>
						<Link href="/games">Cancel</Link>
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
