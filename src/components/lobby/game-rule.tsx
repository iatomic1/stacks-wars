import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";

interface GameRuleProps {
	currentRule: string;
	repeatCount: number;
	requiredRepeats: number;
}

export default function GameRule({
	currentRule,
	repeatCount,
	requiredRepeats,
}: GameRuleProps) {
	return (
		<Card className="bg-primary/5 border-primary/10">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
						<User className="h-4 w-4 text-primary" />
					</div>
					<div>
						<CardTitle className="text-sm text-primary">
							Current Rule ({repeatCount}/{requiredRepeats})
						</CardTitle>
						<p className="text-sm font-medium mt-1">
							{currentRule}
						</p>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}
