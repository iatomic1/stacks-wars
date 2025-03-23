// components/lexi-wars/players-list.tsx
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  username: string;
  score: number;
  isCurrentPlayer?: boolean;
}

interface PlayersListProps {
  players: Player[];
  currentUsername: string;
  isPlaying: boolean;
}

export default function PlayersList({
  players,
  currentUsername,
  isPlaying,
}: PlayersListProps) {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Players
        </h3>

        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.username}
              className={cn(
                "flex items-center justify-between p-2 rounded-md transition-colors",
                player.isCurrentPlayer && isPlaying
                  ? "bg-primary/15"
                  : "bg-background/50",
                player.username === currentUsername
                  ? "border-l-4 border-primary pl-2"
                  : "",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="font-medium">
                  {player.username}
                  {player.username === currentUsername && " (You)"}
                </span>
                {player.isCurrentPlayer && isPlaying && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    Current Turn
                  </span>
                )}
              </div>
              <span className="font-bold">{player.score}</span>
            </div>
          ))}

          {players.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Waiting for players to join...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
