import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Trophy, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/app/games/page";

export default function GameCard({ game }: { game: Game }) {
	return (
		<Card className="overflow-hidden">
			<div className="md:grid md:grid-cols-[1fr_300px] md:gap-6">
				<div>
					<CardHeader>
						<div className="flex justify-between items-start">
							<div>
								<CardTitle className="text-2xl">
									{game.name}
								</CardTitle>
								<CardDescription>
									{game.type &&
										game.type.map((type) => (
											<Badge
												variant="outline"
												key={type}
												className="mr-2"
											>
												{type}
											</Badge>
										))}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="mb-4">{game.description}</p>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">
										Total Volume
									</p>
									<p className="text-lg font-bold">
										{game.totalPrize} STX
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium">
										Active Lobbies
									</p>
									<p className="text-lg font-bold">
										{game.activePools}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="mt-3">
						<div className="flex gap-4">
							{/*<Link href={`/lobby?game=${game.id}`}>
								<Button variant="outline">Learn More</Button>
							</Link>*/}
							<Link href={`/games/${game.id}`}>
								<Button className="gap-1.5">
									Enter Game
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</div>
					</CardFooter>
				</div>
				<div className="relative hidden md:block">
					<Image
						src={game.image || "/placeholder.svg"}
						alt={game.name}
						className="absolute inset-0 h-full w-full object-cover"
						width={300}
						height={300}
					/>
				</div>
				<div className="md:hidden mt-4">
					<Image
						src={game.image || "/placeholder.svg"}
						alt={game.name}
						className="w-full rounded-md object-cover"
						width={400}
						height={200}
					/>
				</div>
			</div>
		</Card>
	);
}
