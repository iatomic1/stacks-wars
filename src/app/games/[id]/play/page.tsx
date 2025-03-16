"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GameRule from "@/components/games/game-rule";
import GameTimer from "@/components/games/game-timer";
import GameHeader from "@/components/games/game-header";
import words from "an-array-of-english-words";

export default function LexiWar() {
	const [word, setWord] = useState("");
	const [timeLeft, setTimeLeft] = useState(10);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const gameStateRef = useRef({ isTimeUp: false, isStarted: false });

	// Prevent paste
	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		toast.error("Pasting is not allowed!", { position: "top-center" });
	};

	// Prevent copy
	const handleCopy = (e: React.ClipboardEvent) => {
		e.preventDefault();
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0 && !gameStateRef.current.isTimeUp) {
			setIsPlaying(false);
			gameStateRef.current.isTimeUp = true;
			toast.error("Time's up!", { position: "top-center" });
		}
		return () => clearInterval(timer);
	}, [isPlaying, timeLeft]);

	const isValidWord = (word: string) => words.includes(word.toLowerCase());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isPlaying) return;

		if (word.length < 4) {
			toast.error("Word must be at least 4 characters!", {
				position: "top-center",
			});
			return;
		}

		if (!isValidWord(word)) {
			toast.error("Invalid word! Try again.", { position: "top-center" });
			return;
		}

		const points = word.length;
		setScore((prev) => prev + points);
		setWord("");
		toast.success(`Valid word! +${points} points`, {
			position: "top-center",
		});
		setTimeLeft(10);
	};

	const startGame = () => {
		if (!gameStateRef.current.isStarted) {
			gameStateRef.current.isStarted = true;
			gameStateRef.current.isTimeUp = false;
			setIsPlaying(true);
			setTimeLeft(10);
			setScore(0);
			setWord("");
			toast.info(
				"Game started! Type words that are at least 4 characters long",
				{ position: "top-center" }
			);

			setTimeout(() => {
				gameStateRef.current.isStarted = false;
			}, 100);
		}
	};

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

					<div
						className="space-y-4 select-none"
						aria-hidden="true"
						role="presentation"
					>
						<GameHeader score={score} />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<GameRule />
							<GameTimer timeLeft={timeLeft} />
						</div>

						<Card className="border-2 border-primary/10">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2">
										<User className="h-5 w-5 text-primary" />
										Your Turn
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<Input
										type="text"
										placeholder={
											isPlaying
												? "Type your word here..."
												: "Press Start Game to begin"
										}
										value={word}
										onChange={(e) =>
											setWord(
												e.target.value.toLowerCase()
											)
										}
										onPaste={handlePaste}
										onCopy={handleCopy}
										onCut={handleCopy}
										disabled={!isPlaying || timeLeft === 0}
										className="text-lg select-none"
										autoComplete="off"
										autoFocus
										aria-hidden="true"
										tabIndex={-1}
									/>
									<div className="flex justify-end">
										<Button
											onClick={startGame}
											type="button"
											size="lg"
											className="w-full md:w-auto"
											aria-hidden="true"
											tabIndex={-1}
										>
											{!isPlaying
												? "Start Game"
												: "Enter"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>

					<div className="sr-only" role="alert">
						This is a competitive typing game that requires manual
						keyboard input. Screen readers are not supported for
						fair gameplay.
					</div>
				</div>
			</main>
		</div>
	);
}
