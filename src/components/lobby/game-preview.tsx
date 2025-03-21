import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { Lobby } from "@/types/lobbySchema";

export default function GamePreview({ lobby }: { lobby: Lobby }) {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-4 pb-2 sm:p-6 sm:pb-3">
				<CardTitle className="text-sm sm:text-base">
					Game Preview
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Image
					src={
						lobby.game.image ||
						"/lexi-wars.webp?height=300&width=500"
					}
					width={500}
					height={300}
					alt="Game preview"
					className="w-full h-auto object-cover"
				/>
			</CardContent>
			<CardFooter className="flex justify-between p-3 sm:p-4 bg-muted/30">
				<p className="text-xs sm:text-sm font-medium">
					{lobby.game.name}
				</p>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 sm:h-8 text-xs sm:text-sm gap-1 px-2 sm:px-3"
				>
					Game details
					<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
