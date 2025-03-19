import Dexie, { Table } from "dexie";

interface HighScore {
	id: 1; // Always use ID 1 for the single record
	score: number;
	timestamp: Date;
}

export class GameDatabase extends Dexie {
	singleplayerV1!: Table<HighScore>;

	constructor() {
		super("GameDatabase");
		this.version(1).stores({
			singleplayerV1: "id,score,timestamp",
		});
	}
}

export const db = new GameDatabase();
