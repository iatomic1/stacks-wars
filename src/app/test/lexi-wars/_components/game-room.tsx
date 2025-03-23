"use client";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GameRoomProps {
  socket: Socket;
  username: string;
  roomData: {
    roomId: string;
    roomCode: string;
    players: Array<{
      username: string;
      score: number;
      isCurrentPlayer: boolean;
    }>;
  };
}

export default function GameRoom({
  socket,
  username,
  roomData,
}: GameRoomProps) {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    currentRule: "",
    timeLeft: 10,
    minWordLength: 4,
    ruleRepeatCount: 0,
    requiredRepeats: 2,
    currentPlayer: "",
  });
  const [word, setWord] = useState("");
  const [message, setMessage] = useState("");
  const [gameHistory, setGameHistory] = useState<
    Array<{
      player: string;
      word: string;
      points: number;
      timestamp: number;
    }>
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Update this to directly check the current player from gameState
  const isCurrentPlayer = gameState.currentPlayer === username;

  // Focus input when it's player's turn
  useEffect(() => {
    if (isCurrentPlayer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCurrentPlayer, gameState.currentPlayer]);

  // Listen for socket events
  useEffect(() => {
    // Game start event
    socket.on("gameStarted", (data) => {
      setGameState({
        isPlaying: true,
        currentRule: data.currentRule,
        timeLeft: data.timeLeft,
        minWordLength: data.minWordLength,
        ruleRepeatCount: data.ruleRepeatCount,
        requiredRepeats: data.requiredRepeats,
        currentPlayer: data.currentPlayer,
      });
      setMessage(`Game started! ${data.currentRule}`);
      toast.success("Game started!");
    });

    // Timer update
    socket.on("timeUpdate", (data) => {
      setGameState((prev) => ({
        ...prev,
        timeLeft: data.timeLeft,
        currentPlayer: data.currentPlayer,
      }));
    });

    // Turn timed out
    socket.on("turnTimedOut", (data) => {
      setGameState((prev) => ({
        ...prev,
        currentPlayer: data.nextPlayer,
        timeLeft: data.timeLeft,
      }));
      toast.error(`Time's up! Turn passed to ${data.nextPlayer}`);
    });

    // Word submitted successfully
    socket.on("wordSubmitted", (data) => {
      setGameState((prev) => ({
        ...prev,
        currentRule: data.currentRule,
        ruleRepeatCount: data.ruleRepeatCount,
        requiredRepeats: data.requiredRepeats,
        currentPlayer: data.currentPlayer, // This is key - ensure we update the current player
      }));

      // Add to game history
      setGameHistory((prev) => [
        {
          player: data.player.username,
          word: data.word,
          points: data.points,
          timestamp: Date.now(),
        },
        ...prev,
      ]);

      toast.success(
        `${data.player.username} played "${data.word}" for ${data.points} points!`,
      );
      setWord("");
    });

    // Word rejected
    socket.on("wordRejected", (data) => {
      toast.error(`Word rejected: ${data.reason}`);
      setWord("");
    });

    // Game paused
    socket.on("gamePaused", (data) => {
      setGameState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
      toast.info(`Game paused: ${data.reason}`);
    });

    // Room info
    socket.on("roomInfo", (data) => {
      setGameState({
        isPlaying: data.isPlaying,
        currentRule: data.currentRule,
        timeLeft: data.timeLeft,
        minWordLength: data.minWordLength,
        ruleRepeatCount: data.ruleRepeatCount,
        requiredRepeats: data.requiredRepeats,
        currentPlayer: data.currentPlayer || "", // Make sure we receive this
      });
    });

    return () => {
      socket.off("gameStarted");
      socket.off("timeUpdate");
      socket.off("turnTimedOut");
      socket.off("wordSubmitted");
      socket.off("wordRejected");
      socket.off("gamePaused");
      socket.off("roomInfo");
    };
  }, [socket, username]);

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    if (!isCurrentPlayer) {
      toast.error("It's not your turn!");
      return;
    }

    socket.emit("submitWord", {
      roomId: roomData.roomId,
      word: word.trim(),
    });
  };

  const startGame = () => {
    socket.emit("startGame", roomData.roomId);
  };

  const getNextPlayer = () => {
    // Find the current player in the players array
    const currentPlayerIndex = roomData.players.findIndex(
      (p) => p.username === gameState.currentPlayer,
    );

    if (currentPlayerIndex === -1) return "Unknown";

    const nextIndex = (currentPlayerIndex + 1) % roomData.players.length;
    return roomData.players[nextIndex].username;
  };

  return (
    <div className="container max-w-4xl px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Room: {roomData.roomCode}</CardTitle>
                <Badge variant={gameState.isPlaying ? "default" : "outline"}>
                  {gameState.isPlaying ? "In Progress" : "Waiting to Start"}
                </Badge>
              </div>
              <CardDescription>
                {gameState.isPlaying
                  ? `Current Rule: ${gameState.currentRule}`
                  : "The game will begin once you start it"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameState.isPlaying && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Time left: {gameState.timeLeft}s</span>
                    </div>
                    <div>
                      <span className="text-sm">Rule progress: </span>
                      <span className="font-medium">
                        {gameState.ruleRepeatCount}/{gameState.requiredRepeats}
                      </span>
                    </div>
                  </div>
                  <Progress value={(gameState.timeLeft / 10) * 100} />

                  <div className="p-3 border rounded-md bg-muted/50">
                    <p className="text-sm font-medium mb-1">Current Turn</p>
                    <div className="flex justify-between">
                      <p className="font-bold">
                        {gameState.currentPlayer || "..."}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Next: {getNextPlayer()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleWordSubmit} className="mt-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder={
                      isCurrentPlayer
                        ? "Enter your word..."
                        : `Waiting for ${gameState.currentPlayer}'s turn...`
                    }
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    disabled={!gameState.isPlaying || !isCurrentPlayer}
                    className="text-lg"
                  />
                  <Button
                    type="submit"
                    disabled={
                      !gameState.isPlaying || !isCurrentPlayer || !word.trim()
                    }
                  >
                    Submit
                  </Button>
                </div>
              </form>

              {message && (
                <div className="mt-4 p-3 border rounded-md bg-primary/10 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p>{message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!gameState.isPlaying && (
                <Button
                  onClick={startGame}
                  className="w-full"
                  disabled={roomData.players.length < 1}
                >
                  Start Game
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Game history */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gameHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Words played will appear here
                  </p>
                ) : (
                  gameHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="p-2 border-b last:border-0 flex justify-between"
                    >
                      <div>
                        <span className="font-medium">{entry.player}: </span>
                        <span className="italic">{entry.word}</span>
                      </div>
                      <Badge variant="outline">{entry.points} pts</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players list */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Players</CardTitle>
              <CardDescription>
                {roomData.players.length} player
                {roomData.players.length !== 1 ? "s" : ""} in game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roomData.players.map((player, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md ${
                      player.username === username ? "border-primary/50" : ""
                    } ${player.username === gameState.currentPlayer ? "bg-primary/10" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {player.username}
                        {player.username === username && (
                          <span className="text-xs ml-1 text-muted-foreground">
                            (you)
                          </span>
                        )}
                        {player.username === gameState.currentPlayer && (
                          <Badge variant="secondary" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div>{player.score} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
