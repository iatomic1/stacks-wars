import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, User } from "lucide-react";

interface PlayerScore {
	username: string;
	score: number;
	isCurrentPlayer?: boolean;
}

interface GameOverModalProps {
	isOpen: boolean;
	onClose: () => void;
	score: number;
	highScore: number;
	isNewHighScore: boolean;
	onPlayAgain: () => void;
	playerScores?: PlayerScore[];
}

export default function GameOverModal({
	isOpen,
	onClose,
	score,
	//highScore,
	isNewHighScore,
	onPlayAgain,
	playerScores = [],
}: GameOverModalProps) {
	//const improvement = isNewHighScore ? score - highScore : 0;
	const sortedScores = [...playerScores].sort((a, b) => b.score - a.score);
	const currentPlayerRank =
		sortedScores.findIndex((p) => p.isCurrentPlayer) + 1;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Game Over!
					</DialogTitle>
					<DialogDescription className="text-center pt-2 space-y-2">
						{isNewHighScore && <p>🎉 New High Score! 🎉</p>}
						{playerScores.length > 1 && (
							<p>
								{currentPlayerRank === 1
									? "🏆 You Won! 🏆"
									: `You placed ${currentPlayerRank}${
											currentPlayerRank === 2
												? "nd"
												: currentPlayerRank === 3
												? "rd"
												: "th"
									  }`}
							</p>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center w-full gap-4 py-4">
					{/* Personal Stats */}
					<div className="flex items-center gap-6 ">
						<div className="text-center flex flex-col items-center">
							<p className="text-sm font-medium text-muted-foreground mb-1">
								Your Score
							</p>
							<div className="flex items-center gap-2 text-2xl font-bold">
								<Target className="h-6 w-6" />
								{score}
							</div>
						</div>
						{/* <div className="text-center flex flex-col items-center"> */}
						{/*   <p className="text-sm font-medium text-muted-foreground mb-1"> */}
						{/*     {isNewHighScore ? "Previous Best" : "High Score"} */}
						{/*   </p> */}
						{/*   <div className="flex items-center gap-2 text-2xl font-bold"> */}
						{/*     <Trophy className="h-6 w-6" /> */}
						{/*     {highScore} */}
						{/*   </div> */}
						{/* </div> */}
					</div>
					{/* {isNewHighScore && ( */}
					{/*   <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-medium"> */}
					{/*     +{improvement} improvement! */}
					{/*   </div> */}
					{/* )} */}

					{/* Leaderboard */}
					{playerScores.length > 1 && (
						<div className="space-y-2 w-full border-t pt-4">
							<h3 className="text-sm font-medium text-muted-foreground text-center mb-3">
								Final Standings
							</h3>
							<div className="max-h-[298px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
								{sortedScores.map((player, index) => (
									<div
										key={player.username}
										className={`flex items-center justify-between p-3 rounded-lg ${
											player.isCurrentPlayer
												? "bg-primary/10 border border-primary/20"
												: "bg-muted/30"
										}`}
									>
										<div className="flex items-center gap-3">
											<div className="w-6 text-center font-bold text-muted-foreground">
												{index === 0
													? "🥇"
													: index === 1
													? "🥈"
													: index === 2
													? "🥉"
													: index + 1}
											</div>
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<User className="h-4 w-4 text-primary" />
											</div>
											<span className="font-medium">
												{player.username}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Target className="h-4 w-4 text-muted-foreground" />
											<span className="font-bold">
												{player.score}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="sm:justify-center gap-2">
					<Button
						onClick={() => {
							onClose();
							onPlayAgain();
						}}
						className="w-full sm:w-auto"
					>
						Play Again
						<ArrowRight className="h-4 w-4 ml-2" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
