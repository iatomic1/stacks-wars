// lib/GameRoom.ts
export class GameRoom {
  id: string;
  players: { id: string; username: string; score: number }[];
  usedWords: Set<string>;
  currentTurnIndex: number;
  isGameOver: boolean;

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.usedWords = new Set();
    this.currentTurnIndex = 0;
    this.isGameOver = false;
  }

  addPlayer(playerId: string, username: string) {
    this.players.push({ id: playerId, username, score: 0 });
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((player) => player.id !== playerId);
  }

  submitWord(playerId: string, word: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || this.isGameOver) return false;

    if (this.usedWords.has(word)) return false;
    this.usedWords.add(word);

    const points = word.length;
    player.score += points;

    return true;
  }

  endTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
  }

  checkGameOver() {
    // Example condition: All players have had 5 turns
    const maxTurns = 5;
    const totalTurns = this.usedWords.size;
    if (totalTurns >= this.players.length * maxTurns) {
      this.isGameOver = true;
    }
    return this.isGameOver;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }
}
