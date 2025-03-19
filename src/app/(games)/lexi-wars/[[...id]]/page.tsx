import LexiWars from "@/components/lexi-wars/lexi-wars";

interface PlayerScore {
	username: string;
	score: number;
	isCurrentPlayer?: boolean;
}

export default async function LobbyPlayGround({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	if (id) console.log(id[0]);

	let oppsData: PlayerScore[] = [];

	if (id && id[0] === "1") {
		oppsData = [
			{ username: "You", score: 10, isCurrentPlayer: true },
			{ username: "WordWeaver", score: 42 },
			{ username: "LexiconLegend", score: 38 },
			{ username: "VocabVirtuoso", score: 35 },
			{ username: "WordWeaver", score: 42 },
			{ username: "LexiconLegend", score: 38 },
			{ username: "VocabVirtuoso", score: 35 },
		];
	}

	return <LexiWars oppsData={oppsData} />;
}
