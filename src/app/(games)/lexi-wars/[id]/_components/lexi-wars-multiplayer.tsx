"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import GameRule from "@/components/lexi-wars/game-rule";
import GameTimer from "@/components/lexi-wars/game-timer";
import GameHeader from "@/components/lexi-wars/game-header";
import LexiInputForm from "@/components/lexi-wars/lexi-input-form";
import KeyboardComp from "@/components/lexi-wars/keyboard-comp";
import { cn } from "@/lib/utils";
import { useSocketContext } from "@/context/SocketContext";
import { User } from "@/lib/services/users";
import GameOverModal from "./multiplayer-game-over-modal";

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

  const currentPlayer = roomData?.players.find((p) => p.username === username);
  const isEliminated = currentPlayer?.eliminated;
  const isCurrentPlayer = gameState.currentPlayer === username && !isEliminated;

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent));
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
        <div className={cn("container max-w-6xl px-4 py-4 sm:px-6 sm:py-6")}>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Games</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Area */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center relative">
                <GameHeader score={currentPlayer?.score || 0} />
                <Badge variant={gameState.isPlaying ? "default" : "outline"}>
                  {gameState.isPlaying ? "In Progress" : "Waiting"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GameRule currentRule={gameState.currentRule} />
                <GameTimer timeLeft={gameState.timeLeft} />
              </div>

              <Card className="border-2 border-primary/10">
                <CardHeader className="p-4">
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      isCurrentPlayer
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-yellow-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserIcon
                          className={`h-5 w-5 ${
                            isCurrentPlayer
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        />
                        <h3
                          className={`text-base font-semibold ${
                            isCurrentPlayer
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {isCurrentPlayer
                            ? "Your Turn!"
                            : `Waiting for ${gameState.currentPlayer}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {isEliminated ? (
                    <div className="p-4 text-center bg-destructive/10 text-destructive">
                      You've been eliminated!
                    </div>
                  ) : showGameOver ? (
                    <div className="p-4 text-center bg-destructive/10 text-destructive">
                      Game Over
                    </div>
                  ) : (
                    <LexiInputForm
                      handleSubmit={handleSubmit}
                      isPlaying={gameState.isPlaying && isCurrentPlayer}
                      word={word}
                      setWord={setWord}
                      timeLeft={gameState.timeLeft}
                      isMobile={isMobile}
                      inputRef={inputRef}
                      startGame={() => startGame(id, user.id)}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Players & History */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Players</h3>
                  <p>{roomData.players.length} players</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {roomData.players.map((player) => (
                    <div
                      key={player.username}
                      className={cn(
                        "p-3 border rounded-md relative",
                        player.eliminated &&
                          "bg-destructive/10 border-destructive/20",
                        player.isCurrentPlayer && "bg-primary/10",
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          {player.username}
                          {player.eliminated && (
                            <Badge variant="destructive" className="ml-2">
                              Eliminated
                            </Badge>
                          )}
                        </div>
                        <div>{player.score} pts</div>
                      </div>
                      {player.id === user.id && (
                        <Badge className="absolute -top-3 right-1">You</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">History</h3>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {gameHistory.map((entry, i) => (
                    <div key={i} className="flex justify-between p-2 border-b">
                      <div>{entry.word}</div>
                      <Badge>{entry.points} pts</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {isMobile && isCurrentPlayer && (
            <KeyboardComp handleKeyboardInput={handleKeyboardInput} />
          )}

          <GameOverModal
            isOpen={showGameOver}
            score={currentPlayer?.score as number}
            onClose={() => setShowGameOver(false)}
            onPlayAgain={() => console.log("Play again clicked")}
            onBackToMenu={() => console.log("Back to menu clicked")}
            playerScores={roomData.players}
            user={user}
          />
        </div>
      </main>
    </div>
  );
}
