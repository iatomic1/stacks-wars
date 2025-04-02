import React from "react";
import { Card, CardContent } from "../ui/card";
import { Gamepad2, Trophy, Users } from "lucide-react";
import { Lobby } from "@/types/lobbySchema";

export default function LobbyStats({ lobby }: { lobby: Lobby }) {
	return (
		<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
			<Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
				<CardContent className="p-3 sm:p-4 md:p-6">
					<div className="flex items-center gap-2 sm:gap-3 md:gap-4">
						<div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
						</div>
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Pool Size
							</p>
							<p className="text-base sm:text-xl md:text-2xl font-bold">
								{lobby.pool.currentAmount || 0} STX
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
				<CardContent className="p-3 sm:p-4 md:p-6">
					<div className="flex items-center gap-2 sm:gap-3 md:gap-4">
						<div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
						</div>
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Players
							</p>
							<p className="text-base sm:text-xl md:text-2xl font-bold">
								{lobby.participants.length}/{lobby.maxPlayers}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors xs:col-span-2 sm:col-span-1">
				<CardContent className="p-3 sm:p-4 md:p-6">
					<div className="flex items-center gap-2 sm:gap-3 md:gap-4">
						<div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
						</div>
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Game
							</p>
							<p className="text-base sm:text-xl md:text-2xl font-bold">
								{lobby.game.name}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
