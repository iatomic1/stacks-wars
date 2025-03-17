import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ActiveLobbies from "@/components/lobby/active-lobbies";
import { Game, games } from "@/lib/data/games";
import { pools } from "@/app/lobby/page";
import CreatePoolForm from "@/components/lobby/create-lobby-form";
import GameDetails from "@/components/games/game-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SinglePlayer from "@/components/games/single-player";

export default function CreateGame() {
	const game: Game = games[0];

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
			<main className="flex-1">
				<div className="container max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
					<Link
						href="/games"
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 sm:mb-6"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Back to Games</span>
					</Link>

					<div className="space-y-6 sm:space-y-8">
						<GameDetails game={game} />

						<Tabs defaultValue="multiplayer" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="multiplayer">
									Multiplayer
								</TabsTrigger>
								<TabsTrigger value="singleplayer">
									Singleplayer
								</TabsTrigger>
							</TabsList>

							<TabsContent
								value="multiplayer"
								className="space-y-6"
							>
								<CreatePoolForm games={games} />

								<div className="space-y-4">
									<h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
										Active Lobbies
									</h2>
									<ActiveLobbies pools={pools} />
								</div>
							</TabsContent>

							<TabsContent value="singleplayer">
								<SinglePlayer game={game} />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
		</div>
	);
}
