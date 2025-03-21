import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lobby } from "@/types/lobbySchema";

export default function ActiveLobbies({ lobbies }: { lobbies: Lobby[] }) {
	return (
		<>
			{lobbies.map((lobby) => (
				<Card key={lobby.id} className="overflow-hidden">
					<CardHeader className="pb-3">
						<div className="flex justify-between items-start">
							<CardTitle>{lobby.name}</CardTitle>
							<Badge
								variant={
									lobby.status === "open"
										? "default"
										: "secondary"
								}
							>
								{lobby.status === "open" ? "Open" : "Full"}
							</Badge>
						</div>
						<CardDescription>
							Created by{" "}
							{lobby.creator
								? truncateAddress(lobby.creator.stxAddress)
								: "unknown user"}
						</CardDescription>
					</CardHeader>
					<CardContent className="pb-3">
						<div className="grid gap-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Stakes:
								</span>
								{/* <span className="font-medium">{lobby.amount} STX</span> */}
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Game:
								</span>
								<span className="font-medium">
									{lobby.game.name}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">
									Players:
								</span>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">
										{lobby.participants.length}/
										{lobby.maxPlayers}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							asChild
							variant={
								lobby.status === "open" ? "default" : "outline"
							}
							className="w-full gap-1.5 cursor cursor-not-allowed"
							disabled={lobby.status !== "open"}
						>
							<Link
								href={`${
									lobby.status === "open"
										? `/lobby/${lobby.id}`
										: ""
								}`}
								className={`w-full ${
									lobby.status === "open"
										? "cursor-pointer"
										: "cursor-not-allowed"
								}`}
							>
								{lobby.status === "open"
									? "Join Lobby"
									: "Lobby Full"}
								{lobby.status === "open" && (
									<ArrowRight className="h-4 w-4" />
								)}
							</Link>
						</Button>
					</CardFooter>
				</Card>
			))}
		</>
	);
}
