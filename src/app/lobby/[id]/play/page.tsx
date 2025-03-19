import LexiWars from "@/components/lexi-wars/lexi-war";

const oppsData = [
	{ username: "You", score: 10, isCurrentPlayer: true },
	{ username: "WordWeaver", score: 42 },
	{ username: "LexiconLegend", score: 38 },
	{ username: "VocabVirtuoso", score: 35 },
	{ username: "WordWeaver", score: 42 },
	{ username: "LexiconLegend", score: 38 },
	{ username: "VocabVirtuoso", score: 35 },
];

export default function LobbyPlayGround() {
	return <LexiWars isMultiplayer={true} oppsData={oppsData} />;
}
