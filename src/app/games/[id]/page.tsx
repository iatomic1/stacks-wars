import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Gamepad2, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ActiveLobbies from "@/components/lobby/active-lobbies";
import { Game, games } from "../page";
import { pools } from "@/app/lobby/page";
import CreatePoolForm from "@/components/lobby/create-lobby-form";

// Dummy pools data - in real app this would come from an API

export default function CreateGame() {
	async function createLobby(formData: FormData) {
		"use server";

		console.log(formData);

		// Here you would typically make an API call to create the pool
		// For now, we'll just redirect to a dummy lobby ID
		redirect("/lobby/pool-123456");
	}

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
						{/* Game Details */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
										<Gamepad2 className="h-6 w-6 text-primary" />
									</div>
									<div>
										<CardTitle className="text-2xl">
											{game.name}
										</CardTitle>
										<div className="flex gap-2 mt-2">
											{game.type.map((type) => (
												<Badge
													key={type}
													variant="secondary"
												>
													{type}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									{game.description}
								</p>
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
											Active Pools:
										</span>
										<span className="font-medium">
											{game.activePools}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Create Lobby Form */}
						<CreatePoolForm games={games} />

						{/* Active Lobbies */}
						<div className="space-y-4">
							<h2 className="text-xl font-semibold">
								Active Lobbies
							</h2>
							<ActiveLobbies pools={pools} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
