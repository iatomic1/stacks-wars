import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Timer } from "lucide-react";

export default function GameTimer({ timeLeft }: { timeLeft: number }) {
	return (
		<Card
			className={`${
				timeLeft <= 3
					? "bg-destructive/5 border-destructive/10"
					: "bg-muted"
			}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm">Time Left</CardTitle>
					<Badge
						variant={timeLeft <= 3 ? "destructive" : "secondary"}
						className="text-2xl px-3 py-1"
					>
						<Timer className="h-4 w-4 mr-2" />
						{timeLeft}s
					</Badge>
				</div>
			</CardHeader>
		</Card>
	);
}
