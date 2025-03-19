"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GameRule from "@/components/games/game-rule";
import GameTimer from "@/components/games/game-timer";
import GameHeader from "@/components/games/game-header";
import GameOverModal from "@/components/games/game-over-modal";
import words from "an-array-of-english-words";
import { db } from "@/lib/db";
import KeyboardComp from "@/components/games/keyboard-comp";
import LexiInputForm from "@/components/games/lexi-input-form";
import { rules } from "@/lib/lexiValidationRule";

export default function LexiWar() {
	const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
	const [word, setWord] = useState("");
	const [timeLeft, setTimeLeft] = useState(10);
	const [score, setScore] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const gameStateRef = useRef({ isTimeUp: false, isStarted: false });
	const [highScore, setHighScore] = useState(0);
	const [previousHighScore, setPreviousHighScore] = useState(0);
	const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
	const [ruleRepeatCount, setRuleRepeatCount] = useState(0);
	const [requiredRepeats, setRequiredRepeats] = useState(2);
	const [randomLetter, setRandomLetter] = useState("a");
	const [minWordLength, setMinWordLength] = useState<number>(4);
	const [gameRules, setGameRules] = useState(() =>
		rules(minWordLength, randomLetter)
	);
	const [showGameOver, setShowGameOver] = useState(false);
	const [isNewHighScore, setIsNewHighScore] = useState(false);

	// Detect mobile device
	useEffect(() => {
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		);
	}, []);

	// Update rules when minWordLength or randomLetter changes
	useEffect(() => {
		setGameRules(rules(minWordLength, randomLetter));
	}, [minWordLength, randomLetter]);

	// Generate new random values when rule changes
	useEffect(() => {
		setRandomLetter(
			"abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
		);
	}, [currentRuleIndex, ruleRepeatCount, minWordLength]);

	// Timer and high score update
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0 && !gameStateRef.current.isTimeUp) {
			setIsPlaying(false);
			gameStateRef.current.isTimeUp = true;

			const isNewRecord = score > highScore;
			setIsNewHighScore(isNewRecord);

			if (isNewRecord) {
				db.singleplayerV1
					.put({
						id: 1,
						score: score,
						timestamp: new Date(),
					})
					.then(() => {
						setPreviousHighScore(highScore);
						setHighScore(score);
					});
			}

			toast.info(`Time's up!`, {
				position: "top-center",
			});

			setShowGameOver(true);
			setWord("");
		}
		return () => clearInterval(timer);
	}, [isPlaying, timeLeft, score, highScore]);

	const normalizeWord = (word: string) => {
		return word.replace(/\s+/g, "").toLowerCase();
	};

	const isValidWord = useCallback((word: string) => {
		const cleanWord = normalizeWord(word);
		return words.includes(cleanWord);
	}, []);

	const validateWord = (word: string) => {
		if (word.length < minWordLength) {
			toast.error(
				`Word must be at least ${minWordLength} characters long!`,
				{
					position: "top-center",
				}
			);
			setWord("");
			return false;
		}

		if (usedWords.has(word)) {
			toast.error("You've already used this word!", {
				position: "top-center",
			});
			setWord("");
			return false;
		}

		if (!isValidWord(word)) {
			toast.error("Invalid word! Try again.", {
				position: "top-center",
			});
			setWord("");
			return false;
		}

		// Get current rule
		const currentRule = gameRules[currentRuleIndex];

		// Validate against current rule
		if (currentRuleIndex !== 0 && !currentRule.validator(word)) {
			setWord("");
			return false;
		}

		return true;
	};

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!isPlaying) return;

		const cleanWord = normalizeWord(word);

		if (!validateWord(cleanWord)) return;

		// Word is valid, update game state
		setUsedWords((prev) => new Set(prev).add(cleanWord));
		const points = cleanWord.length;
		setScore((prev) => prev + points);
		setWord("");

		// Update rule progression
		setRuleRepeatCount((prev) => {
			const newCount = prev + 1;
			if (newCount >= requiredRepeats) {
				// Move to next rule
				const nextRuleIndex = (currentRuleIndex + 1) % gameRules.length;
				setCurrentRuleIndex(nextRuleIndex);

				// If we're completing a full cycle
				if (nextRuleIndex === 0) {
					const newMinLength = minWordLength + 2;
					setMinWordLength(newMinLength); // Increase minimum word length by 2
					toast.success(
						`Difficulty increased! Minimum word length is now ${newMinLength}!`,
						{
							position: "top-center",
						}
					);
				}

				// Randomize next required repeats between 2 and 4
				const randomRepeats = Math.floor(Math.random() * 3) + 2;
				setRequiredRepeats(randomRepeats);

				return 0; // Reset repeat count
			}
			return newCount;
		});

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
			setUsedWords(new Set());
			setCurrentRuleIndex(0);
			setRuleRepeatCount(0);
			setRequiredRepeats(2);
			toast.info(
				"Game started! Follow the rules shown above. Each level brings new challenges!",
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

	const handleCloseGameOver = () => {
		setShowGameOver(false);
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
						<GameHeader score={score} highScore={highScore} />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<GameRule
								currentRule={gameRules[currentRuleIndex].rule}
								repeatCount={ruleRepeatCount}
								requiredRepeats={requiredRepeats}
							/>
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
								<LexiInputForm
									handleSubmit={handleSubmit}
									isPlaying={isPlaying}
									word={word}
									setWord={setWord}
									timeLeft={timeLeft}
									isMobile={isMobile}
									startGame={startGame}
								/>
							</CardContent>
						</Card>
					</div>

					{isMobile && isPlaying && (
						<KeyboardComp
							handleKeyboardInput={handleKeyboardInput}
						/>
					)}

					<GameOverModal
						isOpen={showGameOver}
						onClose={handleCloseGameOver}
						score={score}
						highScore={previousHighScore}
						isNewHighScore={isNewHighScore}
						onPlayAgain={startGame}
					/>

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
