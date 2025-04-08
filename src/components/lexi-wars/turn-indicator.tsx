import { User } from "lucide-react";
import React from "react";

interface TurnIndicatorProps {
	isCurrentPlayer?: boolean;
	currentPlayer?: string;
}

export default function TurnIndicator({
	isCurrentPlayer,
	currentPlayer,
}: TurnIndicatorProps) {
	return (
		<div
			className={`p-4 rounded-lg border-2
			${
				isCurrentPlayer
					? "bg-green-500/10 border-green-500/20"
					: !isCurrentPlayer && currentPlayer
					? "bg-yellow-500/10"
					: "bg-green-500/10 border-green-500/20"
			}
			`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<User
						className={`h-5 w-5
						${
							isCurrentPlayer
								? "text-green-500"
								: !isCurrentPlayer && currentPlayer
								? "text-yellow-500"
								: "text-green-500"
						}
						`}
					/>
					<h3
						className={`text-base font-semibold text-green-500
						${
							isCurrentPlayer
								? "text-green-500"
								: !isCurrentPlayer && currentPlayer
								? "text-yellow-500"
								: "text-green-500"
						}
						`}
					>
						{isCurrentPlayer
							? "It's Your Turn!"
							: !isCurrentPlayer && currentPlayer
							? `Waiting for ${currentPlayer}`
							: "Your Turn!"}
					</h3>
				</div>
			</div>
		</div>
	);
}
