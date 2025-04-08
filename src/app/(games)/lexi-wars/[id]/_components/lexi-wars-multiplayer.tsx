"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GameRule from "@/components/lexi-wars/game-rule";
import GameTimer from "@/components/lexi-wars/game-timer";
import GameHeader from "@/components/lexi-wars/game-header";
import LexiInputForm from "@/components/lexi-wars/lexi-input-form";
import KeyboardComp from "@/components/lexi-wars/keyboard-comp";
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/context/SocketContext";
import { User } from "@/lib/services/users";
import GameOverModal from "@/components/lexi-wars/multiplayer-game-over-modal";
import BackToGames from "@/components/lexi-wars/back-to-games";
import TurnIndicator from "@/components/lexi-wars/turn-indicator";
import { useRouter } from "next/navigation";
import PlayersGameHistory from "@/components/lexi-wars/players-game-history";

export default function LexiWarsMultiplayer({
	id,
	username,
	user,
}: {
	id: string;
	username: string;
	user: User;
}) {
	const {
		roomData,
		gameState,
		gameHistory,
		startGame,
		submitWord,
		showGameOver,
		setShowGameOver,
	} = useSocketContext();
	const [word, setWord] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const router = useRouter();

	const currentPlayer = roomData?.players.find(
		(p) => p.username === username
	);
	const isEliminated = currentPlayer?.eliminated;
	const isCurrentPlayer =
		gameState.currentPlayer === username && !isEliminated;

	useEffect(() => {
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
		);
		if (isCurrentPlayer && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isCurrentPlayer]);

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (
			!word.trim() ||
			!gameState.isPlaying ||
			isEliminated ||
			!isCurrentPlayer
		)
			return;

		submitWord(id, word.trim(), user.id);
		setWord("");
	};

	const handleKeyboardInput = (input: string) => {
		if (input === "{enter}") handleSubmit();
		else if (input === "{bksp}") setWord((prev) => prev.slice(0, -1));
		else setWord((prev) => (prev + input).toLowerCase());
	};

	if (!roomData) return <p>Loading game...</p>;

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
			<main className="flex-1">
				<div
					className={cn(
						"container max-w-6xl px-4 py-4 sm:px-6 sm:py-6"
					)}
				>
					<BackToGames />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Game Area */}
						<div className="lg:col-span-2 space-y-4 select-none">
							{/*<div className="flex justify-between items-center relative">*/}
							<GameHeader
								score={currentPlayer?.score || 0}
								highScore={20}
							/>
							{/*<Badge
									variant={
										gameState.isPlaying
											? "default"
											: "outline"
									}
								>
									{gameState.isPlaying
										? "In Progress"
										: "Waiting"}
								</Badge>*/}

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<GameRule
									currentRule={gameState.currentRule}
									repeatCount={2}
									requiredRepeats={gameState.requiredRepeats}
								/>
								<GameTimer timeLeft={gameState.timeLeft} />
							</div>

							<Card className="border-2 border-primary/10">
								<CardHeader className="p-4">
									<TurnIndicator
										isCurrentPlayer={isCurrentPlayer}
										currentPlayer={gameState.currentPlayer}
									/>
								</CardHeader>
								<CardContent className="p-4">
									{isEliminated ? (
										<div className="p-4 text-center bg-destructive/10 text-destructive">
											You&apos;ve been eliminated!
										</div>
									) : showGameOver ? (
										<div className="p-4 text-center bg-destructive/10 text-destructive">
											Game Over
										</div>
									) : (
										<LexiInputForm
											handleSubmit={handleSubmit}
											isPlaying={
												gameState.isPlaying &&
												isCurrentPlayer
											}
											word={word}
											setWord={setWord}
											timeLeft={gameState.timeLeft}
											isMobile={isMobile}
											inputRef={inputRef}
											startGame={() =>
												startGame(id, user.id)
											}
										/>
									)}
								</CardContent>
							</Card>
						</div>

						<PlayersGameHistory
							gameHistory={gameHistory}
							roomData={roomData}
							user={user}
						/>
					</div>

					{isMobile && isCurrentPlayer && (
						<KeyboardComp
							handleKeyboardInput={handleKeyboardInput}
						/>
					)}

					<GameOverModal
						isOpen={showGameOver}
						score={currentPlayer?.score as number}
						onClose={() => setShowGameOver(false)}
						onPlayAgain={() => console.log("Play again clicked")}
						onBackToLobby={() => {
							router.push("/lobby");
						}}
						playerScores={roomData.players}
						user={user}
					/>
				</div>
			</main>
		</div>
	);
}
