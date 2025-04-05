import { games } from "@/lib/db/schema/games";
import { lobby } from "@/lib/db/schema/lobby";
import { participants } from "@/lib/db/schema/participants";
import { pools } from "@/lib/db/schema/pools";

//export interface Game {
//	id: string;
//	createdAt: string;
//	updatedAt: string;
//	name: string;
//	description: string;
//	tags: string[];
//	image: string | null;
//	activeLobbies: number;
//	totalPrize: number;
//}

//export interface Pool {
//	id: string;
//	createdAt: string;
//	updatedAt: string;
//	lobbyId: string;
//	currentAmount: number;
//	maxPlayers: number;
//	entryAmount: number;
//	contractId: string | null;
//	deployContractTxId: string;
//}

//interface Participant {
//	id: string;
//	stxAddress: string;
//	username: string;
//	ready: boolean;
//	amount: number;
//}

//export interface Lobby {
//	id: string;
//	createdAt: string;
//	updatedAt: string;
//	name: string;
//	creator: Participant;
//	gameId: string;
//	maxPlayers: number;
//	status: "pending" | "open" | "completed" | "cancelled";
//	description: string | null;
//	game: Game;
//	pool: Pool;
//	participants: Participant[];
//}

export type Pool = typeof pools.$inferSelect;
export type Game = typeof games.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type Lobby = typeof lobby.$inferSelect;
export interface LobbySchema extends Lobby {
	pool: Pool;
	game: Game;
	participants: Participant[];
}
