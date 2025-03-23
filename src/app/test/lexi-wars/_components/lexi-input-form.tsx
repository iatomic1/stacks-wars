// components/lexi-wars/lexi-input-form.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, RefObject } from "react";

interface LexiInputFormProps {
  handleSubmit: (e?: FormEvent) => void;
  isPlaying: boolean;
  word: string;
  setWord: (word: string) => void;
  timeLeft: number;
  isMobile: boolean;
  inputRef: RefObject<HTMLInputElement>;
  startGame: () => void;
  isDisabled?: boolean;
  buttonText?: string;
}

export default function LexiInputForm({
  handleSubmit,
  isPlaying,
  word,
  setWord,
  timeLeft,
  isMobile,
  inputRef,
  startGame,
  isDisabled = false,
  buttonText,
}: LexiInputFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder={isPlaying ? "Type your word..." : "Ready to play?"}
          value={word}
          onChange={(e) => setWord(e.target.value.toLowerCase())}
          className="flex-1 text-lg"
          disabled={!isPlaying || isDisabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus={!isMobile}
        />

        {isPlaying ? (
          <Button
            type="submit"
            size="lg"
            disabled={word.trim().length === 0 || timeLeft <= 0 || isDisabled}
          >
            {buttonText || "Submit"}
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={startGame}>
            {buttonText || "Start Game"}
          </Button>
        )}
      </div>
    </form>
  );
}
