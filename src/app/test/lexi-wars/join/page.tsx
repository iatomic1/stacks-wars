// app/games/lexi-wars/join/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import GameRoom from "../_components/game-room";
import { useSocket } from "@/hooks/useSocket";

export default function JoinGamePage() {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const { isConnected, joinRoom, roomData, socket } = useSocket();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomCode || !username) {
      toast.error("Please enter a room code and username.");
      return;
    }

    joinRoom(roomCode, username);
    console.log(roomData);
  };

  if (roomData && socket) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
        <GameRoom socket={socket} username={username} roomData={roomData} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <main className="flex-1">
        <div className="container max-w-lg px-4 py-8 sm:px-6 sm:py-12">
          <Link
            href="/games/lexi-wars"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to LexiWars</span>
          </Link>

          <Card className="border-2 border-primary/10">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">
                Join a Game
              </CardTitle>
              <CardDescription className="text-center">
                Enter a room code and your username to join a game
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="roomCode" className="text-sm font-medium">
                    Room Code
                  </label>
                  <Input
                    id="roomCode"
                    placeholder="Enter 6-digit room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="text-lg"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Your Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="text-lg"
                    autoComplete="off"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isConnected}
                >
                  {isConnected ? "Join Game" : "Connecting..."}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
