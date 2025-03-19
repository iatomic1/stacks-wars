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
import { POOL } from "@/lib/data/lobby";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ActiveLobbies({ pools }: { pools: POOL[] }) {
	return (
		<>
			{pools.map((pool) => (
				<Card key={pool.id} className="overflow-hidden">
					<CardHeader className="pb-3">
						<div className="flex justify-between items-start">
							<CardTitle>{pool.name}</CardTitle>
							<Badge
								variant={
									pool.status === "open"
										? "default"
										: "secondary"
								}
							>
								{pool.status === "open" ? "Open" : "Full"}
							</Badge>
						</div>
						<CardDescription>
							Created by{" "}
							{truncateAddress(pool.creator.stxAddress)}
						</CardDescription>
					</CardHeader>
					<CardContent className="pb-3">
						<div className="grid gap-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Stakes:
								</span>
								<span className="font-medium">
									{pool.amount} STX
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Game:
								</span>
								<span className="font-medium">
									{pool.game.name}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">
									Players:
								</span>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">
										{pool.participants.length}/
										{pool.maxPlayers}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							asChild
							variant={
								pool.status === "open" ? "default" : "outline"
							}
							className="w-full gap-1.5 cursor cursor-not-allowed"
							disabled={pool.status !== "open"}
						>
							<Link
								href={`${
									pool.status === "open"
										? `/lobby/${pool.id}`
										: ""
								}`}
								className={`w-full ${
									pool.status === "open"
										? "cursor-pointer"
										: "cursor-not-allowed"
								}`}
							>
								{pool.status === "open"
									? "Join Lobby"
									: "Lobby Full"}
								{pool.status === "open" && (
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
