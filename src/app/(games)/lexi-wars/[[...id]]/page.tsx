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
	if (id) console.log(id);
	else console.log("No id");

	let oppsData: PlayerScore[] = [];

	if (id && id[0] === "c65e6288-aec4-4d8e-b07e-102003956f00") {
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
