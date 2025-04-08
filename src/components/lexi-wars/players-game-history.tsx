import React from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { SocketContextType } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import { User } from "@/lib/services/users";

interface PlayersGameHistoryProps {
	gameHistory: SocketContextType["gameHistory"];
	roomData: SocketContextType["roomData"];
	user: User;
}

export default function PlayersGameHistory({
	gameHistory,
	roomData,
	user,
}: PlayersGameHistoryProps) {
	return (
		<div className="lg:col-span-1 space-y-6">
			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">Players</h3>
					<p>{roomData?.players.length} players</p>
				</CardHeader>
				<CardContent className="space-y-2">
					{roomData?.players.map((player) => (
						<div
							key={player.username}
							className={cn(
								"p-3 border rounded-md relative",
								player.eliminated &&
									"bg-destructive/10 border-destructive/20",
								player.isCurrentPlayer && "bg-primary/10"
							)}
						>
							<div className="flex justify-between items-center">
								<div>
									{player.username}
									{player.eliminated && (
										<Badge
											variant="destructive"
											className="ml-2"
										>
											Eliminated
										</Badge>
									)}
								</div>
								<div>{player.score} pts</div>
							</div>
							{player.id === user.id && (
								<Badge className="absolute -top-3 right-1">
									You
								</Badge>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<h3 className="text-lg font-semibold">History</h3>
				</CardHeader>
				<CardContent className="max-h-[300px] overflow-y-auto">
					{gameHistory.map((entry, i) => (
						<div
							key={i}
							className="flex justify-between p-2 border-b"
						>
							<div>{entry.word}</div>
							<Badge>{entry.points} pts</Badge>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
