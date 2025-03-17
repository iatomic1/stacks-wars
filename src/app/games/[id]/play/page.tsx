"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GameRule from "@/components/games/game-rule";
import GameTimer from "@/components/games/game-timer";
import GameHeader from "@/components/games/game-header";
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
	const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
	const [ruleRepeatCount, setRuleRepeatCount] = useState(0);
	const [requiredRepeats, setRequiredRepeats] = useState(2);
	const [randomLetter, setRandomLetter] = useState("a");
	const [randomLength, setRandomLength] = useState(4);

	// Detect mobile device
	useEffect(() => {
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		);
	}, []);

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

			toast.info(`Time's up! Final Score: ${score}`, {
				position: "top-center",
			});
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

	// Generate new random values when rule changes
	useEffect(() => {
		setRandomLetter(
			"abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
		);
		setRandomLength(Math.floor(Math.random() * 6) + 4);
	}, [currentRuleIndex, ruleRepeatCount]);

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!isPlaying) return;

		const cleanWord = normalizeWord(word);

		if (usedWords.has(cleanWord)) {
			toast.error("You've already used this word!", {
				position: "top-center",
			});
			setWord("");
			return;
		}

		if (!isValidWord(cleanWord)) {
			toast.error("Invalid word! Try again.", { position: "top-center" });
			setWord("");
			return;
		}

		if (!rules[0].validator(cleanWord)) {
			setWord("");
			return;
		}

		// Get current rule
		const currentRule = rules[currentRuleIndex];

		// Validate against current rule
		if (
			currentRuleIndex !== 0 &&
			!currentRule.validator(
				cleanWord,
				currentRule.rule.includes("random letter")
					? randomLetter
					: randomLength
			)
		) {
			setWord("");
			return;
		}

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
				const nextRuleIndex = (currentRuleIndex + 1) % rules.length;
				setCurrentRuleIndex(nextRuleIndex);

				// Calculate next required repeats
				if (requiredRepeats === 4) {
					setRequiredRepeats(2); // Reset to 2 if we hit 4
				} else {
					setRequiredRepeats((prev) => prev + 1); // Increment repeats
				}

				// Announce level up
				toast.success(`Level Up! New challenge unlocked!`, {
					position: "top-center",
					duration: 3000,
				});

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
								currentRule={
									rules[currentRuleIndex].getRule
										? rules[currentRuleIndex].getRule(
												rules[
													currentRuleIndex
												].rule.includes("random letter")
													? randomLetter
													: randomLength
										  )
										: rules[currentRuleIndex].rule
								}
								currentRuleIndex={currentRuleIndex}
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
