"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Target,
	ArrowRight,
	User,
	Trophy,
	Home,
	Medal,
	Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/services/users";

interface PlayerScore {
	id: string;
	username: string;
	score: number;
	isCurrentPlayer?: boolean;
	eliminated?: boolean;
	position?: number;
}

interface GameOverModalProps {
	isOpen: boolean;
	onClose: () => void;
	score: number;
	onPlayAgain: () => void;
	onBackToMenu?: () => void;
	playerScores?: PlayerScore[];
	user: UserType;
}

export default function GameOverModal({
	isOpen,
	onClose,
	score,
	onPlayAgain,
	onBackToMenu,
	playerScores = [],
	user,
}: GameOverModalProps) {
	const [animate, setAnimate] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	const sortedScores = [...playerScores].sort((a, b) => {
		if (a.position === undefined && b.position === undefined) {
			return 0;
		}

		// If a doesn't have a position, it should come first
		if (a.position === undefined) {
			return -1;
		}

		// If b doesn't have a position, it should come first
		if (b.position === undefined) {
			return 1;
		}

		// Both have positions, sort in descending order (higher positions first)
		return b.position - a.position;
	});

	const currentPlayer = sortedScores.find((p) => p.id === user.id);
	const currentPlayerRank = currentPlayer
		? sortedScores.indexOf(currentPlayer) + 1
		: 0;

	const isWinner = currentPlayer ? !currentPlayer.eliminated : false;

	useEffect(() => {
		if (isOpen) {
			setShowConfetti(isWinner);
			const timer = setTimeout(() => setAnimate(true), 100);
			return () => clearTimeout(timer);
		} else {
			setAnimate(false);
		}
	}, [isOpen, isWinner]);

	// useEffect(() => {
	//   console
	// },[isOpen])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-b from-background to-background/95 border-2">
				{showConfetti && <Confetti />}

				<div
					className={cn(
						"absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-500",
						animate && "opacity-100"
					)}
				/>

				<div className="px-6 pt-6 pb-2">
					<DialogHeader>
						<DialogTitle
							className={cn(
								"text-3xl font-bold text-center transition-all duration-500 scale-95 opacity-0",
								animate && "scale-100 opacity-100"
							)}
						>
							{isWinner ? "Victory!" : "Game Over!"}
						</DialogTitle>
						<DialogDescription className="text-center pt-3 space-y-2">
							{playerScores.length > 1 && (
								<p
									className={cn(
										"text-lg font-medium transition-all duration-500 delay-200 translate-y-2 opacity-0",
										animate && "translate-y-0 opacity-100"
									)}
								>
									{isWinner ? (
										<span className="text-amber-500 font-bold flex items-center justify-center gap-2">
											<Crown className="h-5 w-5" />{" "}
											Champion{" "}
											<Crown className="h-5 w-5" />
										</span>
									) : (
										`You placed ${currentPlayerRank}${
											currentPlayerRank === 2
												? "nd"
												: currentPlayerRank === 3
												? "rd"
												: "th"
										}`
									)}
								</p>
							)}
						</DialogDescription>
					</DialogHeader>
				</div>

				<div className="flex flex-col items-center w-full gap-6 px-6 py-5">
					<div
						className={cn(
							"flex items-center gap-8 transition-all duration-500 delay-300 scale-95 opacity-0",
							animate && "scale-100 opacity-100"
						)}
					>
						<div className="text-center flex flex-col items-center">
							<p className="text-sm font-medium text-muted-foreground mb-1">
								Your Score
							</p>
							<div className="flex items-center gap-2 text-3xl font-bold text-primary">
								<Target className="h-6 w-6" />
								{score}
							</div>
						</div>

						{currentPlayerRank > 0 && (
							<div className="text-center flex flex-col items-center border-l pl-8">
								<p className="text-sm font-medium text-muted-foreground mb-1">
									Rank
								</p>
								<div className="flex items-center gap-2 text-3xl font-bold">
									<Medal className="h-6 w-6 text-amber-500" />
									{currentPlayerRank}
								</div>
							</div>
						)}
					</div>

					{/* Leaderboard */}
					{playerScores.length > 1 && (
						<div
							className={cn(
								"space-y-3 w-full border-t pt-5 transition-all duration-500 delay-400 translate-y-4 opacity-0",
								animate && "translate-y-0 opacity-100"
							)}
						>
							<h3 className="text-sm font-medium text-muted-foreground text-center mb-3 flex items-center justify-center gap-2">
								<Trophy className="h-4 w-4" /> Final Standings{" "}
								<Trophy className="h-4 w-4" />
							</h3>
							<div className="max-h-[240px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
								{sortedScores.map((player, index) => {
									const isWinner = !player.eliminated;
									const isCurrentPlayer =
										player.id === user.id;
									const displayRank = index + 1;

									return (
										<div
											key={player.username}
											className={cn(
												"flex items-center justify-between p-3 rounded-lg transition-all",
												isCurrentPlayer
													? "bg-primary/15 border border-primary/30"
													: "bg-muted/50",
												isWinner && "bg-amber-500/10"
											)}
										>
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm",
														isWinner
															? "bg-amber-500 text-white"
															: "bg-muted text-muted-foreground"
													)}
												>
													{isWinner
														? "🏆"
														: displayRank}
												</div>

												<div className="flex items-center gap-2">
													<div
														className={cn(
															"h-8 w-8 rounded-full flex items-center justify-center",
															isCurrentPlayer
																? "bg-primary text-primary-foreground"
																: "bg-primary/10"
														)}
													>
														<User className="h-4 w-4" />
													</div>
													<span
														className={cn(
															"font-medium",
															isCurrentPlayer &&
																"font-bold"
														)}
													>
														{player.username}
														{isCurrentPlayer && (
															<span className="text-xs ml-1">
																(You)
															</span>
														)}
													</span>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<div className="text-right">
													<div className="font-bold">
														{player.score}
													</div>
													<div className="text-xs text-muted-foreground">
														{isWinner && "Winner"}
													</div>
												</div>
												{isWinner ? (
													<Crown className="h-5 w-5 text-amber-500" />
												) : (
													<Target className="h-5 w-5 text-muted-foreground" />
												)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
					<Button
						onClick={() => {
							onClose();
							onPlayAgain();
						}}
						className={cn(
							"w-full sm:w-auto text-base py-6 bg-primary hover:bg-primary/90 transition-all duration-500 delay-500 scale-95 opacity-0",
							animate && "scale-100 opacity-100"
						)}
						size="lg"
					>
						Play Again
						<ArrowRight className="h-5 w-5 ml-2" />
					</Button>

					{onBackToMenu && (
						<Button
							onClick={() => {
								onClose();
								onBackToMenu();
							}}
							variant="outline"
							className={cn(
								"w-full sm:w-auto text-base py-6 transition-all duration-500 delay-600 scale-95 opacity-0",
								animate && "scale-100 opacity-100"
							)}
							size="lg"
						>
							Back to Menu
							<Home className="h-5 w-5 ml-2" />
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Simple confetti effect component
function Confetti() {
	const [particles, setParticles] = useState<
		Array<{
			id: number;
			x: number;
			y: number;
			size: number;
			color: string;
			rotation: number;
			speed: number;
		}>
	>([]);

	useEffect(() => {
		const colors = [
			"#FFD700",
			"#FF6347",
			"#4169E1",
			"#32CD32",
			"#FF1493",
			"#00BFFF",
		];
		const newParticles = Array.from({ length: 100 }).map((_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: -10 - Math.random() * 40,
			size: 5 + Math.random() * 10,
			color: colors[Math.floor(Math.random() * colors.length)],
			rotation: Math.random() * 360,
			speed: 1 + Math.random() * 3,
		}));

		setParticles(newParticles);

		const interval = setInterval(() => {
			setParticles(
				(prev) =>
					prev
						.map((p) => ({
							...p,
							y: p.y + p.speed,
							rotation: p.rotation + 2,
						}))
						.filter((p) => p.y < 120) // Remove particles that have fallen out of view
			);
		}, 50);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{particles.map((p) => (
				<div
					key={p.id}
					className="absolute rounded-sm"
					style={{
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: `${p.size}px`,
						height: `${p.size}px`,
						backgroundColor: p.color,
						transform: `rotate(${p.rotation}deg)`,
						opacity: Math.min(1, (120 - p.y) / 120), // Fade out as they reach the bottom
						transition: "opacity 0.3s",
					}}
				/>
			))}
		</div>
	);
}
