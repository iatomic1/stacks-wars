import { Game } from "@/types/schema";

export const games: Game[] = [
	{
		id: "1",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		tags: `["Word game", "Strategy"]`,
		image: "/lexi-wars.webp",
		activeLobbies: 10,
		totalPrize: "0",
		createdAt: "2025-03-09T12:00:00Z",
		updatedAt: "2025-03-09T12:00:00Z",
		maxPlayers: 10,
	},
	//{
	//	id: "2",
	//	name: "Lexi War",
	//	description:
	//		"Challenge players in our word-rule game and compete for STX rewards",
	//	type: ["Multiplayer", "Strategy"],
	//	totalPrize: 100,
	//	activePools: 5,
	//	image: "/placeholder.svg",
	//},
	//{
	//	id: "3",
	//	name: "Lexi War",
	//	description:
	//		"Challenge players in our word-rule game and compete for STX rewards",
	//	type: ["Multiplayer", "Strategy"],
	//	totalPrize: 100,
	//	activePools: 5,
	//	image: "/placeholder.svg",
	//},
];
