"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import GameRoom from "../_components/game-room";
import { useSocket } from "@/hooks/useSocket";

export default function CreateRoomPage() {
  const [username, setUsername] = useState("");
  const [minWordLength, setMinWordLength] = useState(4);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { isConnected, createRoom, roomData, socket } = useSocket();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username", { position: "top-center" });
      return;
    }

    createRoom(username);
  };

  // If we have room data, show the game room
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
                Create a Game
              </CardTitle>
              <CardDescription className="text-center">
                Set up a new multiplayer game for friends to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
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

                <Collapsible
                  open={advancedOpen}
                  onOpenChange={setAdvancedOpen}
                  className="border rounded-md p-2"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer p-2">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Game Settings
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {advancedOpen ? "Hide" : "Show"}
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="minWordLength"
                        className="text-sm font-medium"
                      >
                        Minimum Word Length
                      </label>
                      <Select
                        value={minWordLength.toString()}
                        onValueChange={(value) =>
                          setMinWordLength(parseInt(value))
                        }
                      >
                        <SelectTrigger id="minWordLength">
                          <SelectValue placeholder="Select minimum word length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 letters</SelectItem>
                          <SelectItem value="4">4 letters</SelectItem>
                          <SelectItem value="5">5 letters</SelectItem>
                          <SelectItem value="6">6 letters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isConnected}
                >
                  {isConnected ? "Create Game" : "Connecting..."}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
