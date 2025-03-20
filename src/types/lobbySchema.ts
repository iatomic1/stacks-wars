export interface Game {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	description: string;
	tags: string[];
	image: string | null;
	activeLobbies: number;
	totalPrize: number;
}

export interface Pool {
	id: string;
	createdAt: string;
	updatedAt: string;
	lobbyId: string;
	currentAmount: number;
	targetAmount: number;
	maxPlayers: number;
	entryAmount: number;
	contractId: string | null;
	deployContractTxId: string;
}

interface Participant {
	id: string;
	stxAddress: string;
	username: string;
	ready: boolean;
	amount: number;
}

export interface Lobby {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	creator: Participant;
	gameId: string;
	maxPlayers: number;
	status: "pending" | "open" | "completed" | "cancelled";
	description: string;
	game: Game;
	pool: Pool;
	participants: Participant[];
}
