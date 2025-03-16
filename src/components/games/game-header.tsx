import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trophy, Brain } from "lucide-react";

export default function GameHeader({ score }: { score: number }) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Brain className="h-6 w-6 text-primary" />
						</div>
						<div>
							<CardTitle className="text-2xl">Lexi War</CardTitle>
							<CardDescription>
								Word Battle Royale
							</CardDescription>
						</div>
					</div>
					<Badge variant="outline" className="text-lg px-3 py-1">
						<Trophy className="h-4 w-4 mr-1" />
						{score}
					</Badge>
				</div>
			</CardHeader>
		</Card>
	);
}
