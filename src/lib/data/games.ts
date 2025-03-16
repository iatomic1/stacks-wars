export interface Game {
	id: string;
	name: string;
	description: string;
	type: string[];
	totalPrize: number;
	activePools: number;
	image: string;
}

export const games: Game[] = [
	{
		id: "1",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
	{
		id: "2",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
	{
		id: "3",
		name: "Lexi War",
		description:
			"Challenge players in our word-rule game and compete for STX rewards",
		type: ["Multiplayer", "Strategy"],
		totalPrize: 100,
		activePools: 5,
		image: "/placeholder.svg",
	},
];
