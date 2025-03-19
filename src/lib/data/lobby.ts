import { Game, games } from "./games";

interface User {
	stxAddress: string;
	username: string;
}

interface Participant {
	user: User;
	amount: string;
	txId: string;
	joinedAt: string;
	ready: boolean;
}

export interface Pool {
	id: string;
	name: string;
	description: string;
	amount: string;
	maxPlayers: number;
	game: Game;
	creator: User;
	participants: Participant[];
	txID: string;
	createdAt: string;
}

export const pool: Pool = {
	id: "pool-123456",
	name: "Lexi War Tournament",
	description:
		"Join our competitive word rule game tournament! Lexi War challenges players to create words following specific rules. Test your vocabulary and strategy against other players for a chance to win the entire prize pool.",
	amount: "0",
	maxPlayers: 20,
	game: games[0],
	creator: {
		stxAddress: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
		username: "Flames",
	},
	participants: [
		{
			user: {
				stxAddress: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
				username: "Flames",
			},
			amount: "250",
			txId: "0x9a4e3712b3e7851c7a0325de8c907b8576d6d4a2b9c6d0ab5c5a9e3b7c2d1e9f",
			joinedAt: "2025-03-10T15:30:00Z",
			ready: true,
		},
		{
			user: {
				stxAddress: "ST2JHG2CWYJA49TTJYHDXN7R2C9K652VS89XVPK6E",
				username: "Atomic",
			},
			amount: "250",
			txId: "0x8b5f4823c4f962da0436ef5d6d7e8690c5b7d3f2a1c9e0db6d5e4f3c2b1a0d9e",
			joinedAt: "2025-03-11T09:45:00Z",
			ready: true,
		},
		{
			user: {
				stxAddress: "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ",
				username: "Hazy",
			},
			amount: "250",
			txId: "0x7c6d5e4f3c2b1a0d9e8f7c6d5e4f3c2b1a0d9e8f7c6d5e4f3c2b1a0d9e8f7c6d",
			joinedAt: "2025-03-12T14:20:00Z",
			ready: false,
		},
	],
	txID: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
	createdAt: "2025-03-09T12:00:00Z",
};

export interface POOL {
	id: number;
	name: string;
	status: string;
	amount: number;
	maxPlayers: number;
	participants: { id: number; stxAddress: string }[];
	creator: { id: number; stxAddress: string };
	game: { id: number; name: string };
}

export const pools: POOL[] = [
	{
		id: 1,
		name: "Lexi War",
		status: "full",
		amount: 100,
		maxPlayers: 2,
		participants: [
			{
				id: 1,
				stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
			},
		],
		creator: {
			id: 1,
			stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
		},
		game: { id: 1, name: "Lexi War" },
	},
	{
		id: 1,
		name: "Lexi War",
		status: "open",
		amount: 100,
		maxPlayers: 2,
		participants: [
			{
				id: 1,
				stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
			},
		],
		creator: {
			id: 1,
			stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
		},
		game: { id: 1, name: "Lexi War" },
	},
	{
		id: 1,
		name: "Lexi War",
		status: "open",
		amount: 100,
		maxPlayers: 2,
		participants: [
			{
				id: 1,
				stxAddress:
					"ST1PQHQKSP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00BV0Z1",
			},
		],
		creator: {
			id: 1,
			stxAddress: "SP16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY3CVQ00B",
		},
		game: { id: 1, name: "Lexi War" },
	},
];
