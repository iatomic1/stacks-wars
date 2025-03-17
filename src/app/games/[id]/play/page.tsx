"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import dynamic from "next/dynamic";
import Dexie, { Table } from "dexie";

const Keyboard = dynamic(() => import("react-simple-keyboard"), {
	ssr: false,
	loading: () => null,
});
import "react-simple-keyboard/build/css/index.css";

interface HighScore {
	id?: number;
	score: number;
	timestamp: Date;
}

export class GameDatabase extends Dexie {
	singleplayerV1!: Table<HighScore>;

	constructor() {
		super("GameDatabase");
		this.version(1).stores({
			singleplayerV1: "++id, score, timestamp",
		});
	}
}

export const db = new GameDatabase();

export default function LexiWar() {
	const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
	const [word, setWord] = useState("");
	const [timeLeft, setTimeLeft] = useState(10);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const gameStateRef = useRef({ isTimeUp: false, isStarted: false });
	const keyboardRef = useRef(null);
	const [highScore, setHighScore] = useState(0);

	// Detect mobile device
	useEffect(() => {
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		);
	}, []);

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		toast.error("Pasting is not allowed!", { position: "top-center" });
	};

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

			if (score > highScore) {
				const improvement = score - highScore;
				db.singleplayerV1
					.put({
						id: 1,
						score: score,
						timestamp: new Date(),
					})
					.then(() => {
						setHighScore(score);
						toast.success(
							`New High Score! 🎉\nPrevious: ${highScore}\nNew: ${score}\nImprovement: +${improvement}`,
							{
								position: "top-center",
								duration: 3000,
							}
						);
					});
			}

			setTimeout(() => {
				toast.error(`Time's up! Final Score: ${score}`, {
					position: "top-center",
				});
			}, 1000);
			setWord("");
		}
		return () => clearInterval(timer);
	}, [isPlaying, timeLeft, score, highScore]);

	const normalizeWord = (word: string) => {
		return word.replace(/\s+/g, "").toLowerCase();
	};

	const isValidWord = useCallback(
		(word: string) => {
			const cleanWord = normalizeWord(word);
			if (usedWords.has(cleanWord)) {
				toast.error("You've already used this word!", {
					position: "top-center",
				});
				return false;
			}
			return words.includes(cleanWord);
		},
		[usedWords]
	);

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!isPlaying) return;

		const cleanWord = normalizeWord(word);

		if (cleanWord.length < 4) {
			toast.error("Word must be at least 4 characters!", {
				position: "top-center",
			});
			return;
		}

		if (usedWords.has(cleanWord)) {
			toast.error("You've already used this word!", {
				position: "top-center",
			});
			return;
		}

		if (!isValidWord(cleanWord)) {
			toast.error("Invalid word! Try again.", { position: "top-center" });
			return;
		}

		// Add the word to used words
		setUsedWords((prev) => new Set(prev).add(cleanWord));

		const points = cleanWord.length;
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
			// Reset used words when starting a new game
			setUsedWords(new Set());
			toast.info(
				"Game started! Type words that are at least 4 characters long. Each word can only be used once!",
				{ position: "top-center" }
			);

			setTimeout(() => {
				gameStateRef.current.isStarted = false;
			}, 100);
		}
	};

	const handleKeyboardInput = (input: string) => {
		if (input === "{enter}") {
			handleSubmit();
		} else if (input === "{bksp}") {
			setWord((prev) => prev.slice(0, -1));
		} else if (input === "{space}") {
			// Ignore space
			return;
		} else {
			setWord((prev) => (prev + input).toLowerCase());
		}
	};

	useEffect(() => {
		const loadHighScore = async () => {
			const record = await db.singleplayerV1.get(1);
			if (record) {
				setHighScore(record.score);
			}
		};
		loadHighScore();
	}, []);

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
						<GameHeader score={score} highScore={highScore} />

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
									autoComplete="off"
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
										tabIndex={-1}
										autoFocus={!isMobile}
										autoComplete="off"
										aria-hidden="true"
										autoCorrect="off"
										spellCheck="false"
										autoCapitalize="off"
										inputMode="none"
										aria-autocomplete="none"
										readOnly={isMobile}
									/>
									<div className="flex justify-end">
										<Button
											onClick={() => {
												if (!isPlaying) startGame();
												else handleSubmit();
											}}
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

					{isMobile && isPlaying && (
						<div className="keyboard">
							<Keyboard
								keyboardRef={(r) => (keyboardRef.current = r)}
								layoutName="default"
								layout={{
									default: [
										"q w e r t y u i o p",
										"a s d f g h j k l",
										"z x c v b n m {bksp}",
										"{enter}",
									],
								}}
								display={{
									"{bksp}": "⌫",
									"{enter}": "Enter",
								}}
								onKeyPress={handleKeyboardInput}
								disableButtonHold
								physicalKeyboardHighlight={false}
							/>
						</div>
					)}

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
