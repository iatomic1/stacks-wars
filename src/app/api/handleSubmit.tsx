import { useState } from "react";

const WRGGame = () => {
	const [userWord, setUserWord] = useState("");
	const [result, setResult] = useState<string | null>(null);

	const handleSubmit = async () => {
		const res = await fetch("/api/bedrock", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userInput: userWord }),
		});

		const data = await res.json();
		if (data.error) {
			console.error("API Error:", data.error);
		} else {
			setResult(data.result);
		}
	};

	return (
		<div>
			<h2>Word Rule Game</h2>
			<input
				type="text"
				value={userWord}
				onChange={(e) => setUserWord(e.target.value)}
				placeholder="Enter a word"
			/>
			<button onClick={handleSubmit}>Submit</button>
			{result && <p>Result: {result}</p>}
		</div>
	);
};

export default WRGGame;
