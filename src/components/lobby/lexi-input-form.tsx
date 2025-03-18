import React, { useRef } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface LexiInputFormProps {
	isPlaying: boolean;
	word: string;
	setWord: (word: string) => void;
	handleSubmit: (e?: React.FormEvent) => void;
	timeLeft: number;
	isMobile: boolean;
	startGame: () => void;
}

export default function LexiInputForm({
	handleSubmit,
	isPlaying,
	word,
	setWord,
	timeLeft,
	isMobile,
	startGame,
}: LexiInputFormProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		toast.error("Pasting is not allowed!", { position: "top-center" });
	};

	const handleCopy = (e: React.ClipboardEvent) => {
		e.preventDefault();
	};

	const handleStartGame = () => {
		startGame();
		setTimeout(() => {
			inputRef.current?.focus();
		}, 50); // Small delay to ensure state updates first
	};

	return (
		<form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
			<Input
				ref={inputRef}
				type="text"
				placeholder={
					isPlaying
						? "Type your word here..."
						: "Press Start Game to begin"
				}
				value={word}
				onChange={(e) => setWord(e.target.value.toLowerCase())}
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
						if (!isPlaying) {
							handleStartGame();
						} else {
							handleSubmit();
						}
					}}
					type="button"
					size="lg"
					className="w-full md:w-auto"
					aria-hidden="true"
					tabIndex={-1}
				>
					{!isPlaying ? "Start Game" : "Enter"}
				</Button>
			</div>
		</form>
	);
}
