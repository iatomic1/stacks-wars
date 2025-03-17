import React from "react";
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
	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		toast.error("Pasting is not allowed!", { position: "top-center" });
	};

	const handleCopy = (e: React.ClipboardEvent) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
			<Input
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
						if (!isPlaying) startGame();
						else handleSubmit();
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
