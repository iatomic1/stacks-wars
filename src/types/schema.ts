import { games } from "@/lib/db/schema/games";
import { lobby } from "@/lib/db/schema/lobby";
import { participants } from "@/lib/db/schema/participants";
import { pools } from "@/lib/db/schema/pools";

export type Pool = typeof pools.$inferSelect;
type Game = typeof games.$inferSelect;
export type GameType = Omit<Game, "tags"> & {
	tags: string[];
};
export type Participant = typeof participants.$inferSelect;
export type Lobby = typeof lobby.$inferSelect;
export interface LobbySchema extends Lobby {
	pool: Pool;
	game: Game;
	participants: Participant[];
}
