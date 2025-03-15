//import { getAllGames } from "@/lib/services/games";
import GameCard from "@/components/games/game-card";

export interface Game {
	id: string;
	name: string;
	description: string;
	type: string[];
	totalPrize: number;
	activePools: number;
	image: string;
}

export const games: Game[] = [
	{
		id: "1",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
	{
		id: "2",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
	{
		id: "3",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
];

export default async function GamesPage() {
	//const games = await getAllGames();

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
									Available Games
								</h1>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Choose from our selection of games to
									compete and win STX rewards
								</p>
							</div>
						</div>

						<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12">
							{games.map((game) => (
								<GameCard key={game.id} game={game} />
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
