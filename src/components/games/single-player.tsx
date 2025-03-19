import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Game } from "@/lib/data/games";

export default function SinglePlayer({ game }: { game: Game }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">Singleplayer Mode</CardTitle>
				<CardDescription>
					Practice your skills and improve your gameplay without the
					pressure of competition
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-muted-foreground">
					<h3 className="font-semibold mb-2">Features:</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>Unlimited practice time</li>
						<li>No entry fees required</li>
						<li>Track your personal high scores</li>
						<li>Perfect for learning the game</li>
					</ul>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button asChild>
					<Link href={`/games/${game.id}/play`}>
						<PlayCircle className="mr-2 h-5 w-5" />
						Play Now
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
