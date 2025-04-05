import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/types/schema";

export default function GameDetails({ game }: { game: Game | null }) {
	if (!game) return null;
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<Gamepad2 className="h-6 w-6 text-primary" />
					</div>
					<div>
						<CardTitle className="text-2xl">{game.name}</CardTitle>
						<div className="flex gap-2 mt-2">
							{/*{game.tags &&
								JSON.parse(game.tags).map((tag: string) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}*/}
							<Badge key={"Word Game"} variant="secondary">
								Word Game
							</Badge>
							<Badge key={"Strategy Game"} variant="secondary">
								Strategy Game
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground mb-4">{game.description}</p>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-2">
						<Trophy className="h-4 w-4 text-primary" />
						<span className="text-sm text-muted-foreground">
							Total Prize Pool:
						</span>
						<span className="font-medium">
							{game.totalPrize} STX
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-primary" />
						<span className="text-sm text-muted-foreground">
							Active Lobbies:
						</span>
						<span className="font-medium">
							{game.activeLobbies}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
