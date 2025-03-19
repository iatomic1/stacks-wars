interface Game {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  tags: string;
  image: string | null;
  activeLobbies: number;
  totalPrize: number;
}

interface Pool {
  id: string;
  createdAt: string;
  updatedAt: string;
  lobbyId: string;
  currentAmount: number;
  amount: number;
  maxPlayers: number;
  contractId: string | null;
  deployContractTxId: string;
}

interface Participant {}

export interface Lobby {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  creatorId: string | null;
  gameId: string;
  maxPlayers: number;
  status: "created" | "active" | "completed" | "cancelled";
  description: string;
  game: Game;
  creator: null | any;
  pool: Pool;
  participants: Participant[];
}
