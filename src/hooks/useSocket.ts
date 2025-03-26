// useSocket.ts
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Player {
  username: string;
  score: number;
  isCurrentPlayer: boolean;
  inactive?: boolean;
  eliminated?: boolean;
}

export interface RoomData {
  roomId: string;
  roomCode: string;
  players: Player[];
  currentRule?: string;
  timeLimit?: number;
  minWordLength?: number;
}

interface GameState {
  isPlaying: boolean;
  currentRule: string;
  timeLeft: number;
  minWordLength: number;
  currentPlayer: string;
}

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentRule: "",
    timeLeft: 0,
    minWordLength: 4,
    currentPlayer: "",
  });
  const [gameHistory, setGameHistory] = useState<
    Array<{ player: string; word: string; points: number; timestamp: number }>
  >([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3002", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setRoomData(null);
      setGameState({
        isPlaying: false,
        currentRule: "",
        timeLeft: 0,
        minWordLength: 4,
        currentPlayer: "",
      });
    });

    // Room Events
    newSocket.on("roomCreated", (data: RoomData) => {
      setRoomData(data);
      toast.success(`Room created: ${data.roomCode}`);
    });

    newSocket.on("roomJoined", (data: RoomData) => {
      setRoomData(data);
    });

    newSocket.on("playerJoined", (data: RoomData) => {
      setRoomData(data);
      toast.info("New player joined");
    });

    // Game Events
    newSocket.on("gameStarted", (data: RoomData & GameState) => {
      setGameState({
        isPlaying: true,
        currentRule: data.currentRule || "",
        timeLeft: data.timeLimit || 0,
        minWordLength: data.minWordLength || 4,
        currentPlayer:
          data.players.find((p) => p.isCurrentPlayer)?.username || "",
      });
      setRoomData(data);
    });

    newSocket.on(
      "timeUpdate",
      (data: { timeLeft: number; currentPlayer: string }) => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: data.timeLeft,
          currentPlayer: data.currentPlayer,
        }));
      },
    );

    newSocket.on(
      "wordSubmitted",
      (data: {
        players: Player[];
        word: string;
        points: number;
        currentRule: string;
        currentPlayer: string;
      }) => {
        setGameHistory((prev) => [
          {
            player: data.currentPlayer,
            word: data.word,
            points: data.points,
            timestamp: Date.now(),
          },
          ...prev,
        ]);

        setRoomData((prev) =>
          prev
            ? {
                ...prev,
                players: data.players,
                currentRule: data.currentRule,
              }
            : null,
        );

        setGameState((prev) => ({
          ...prev,
          currentPlayer: data.currentPlayer,
        }));
      },
    );

    newSocket.on(
      "playerEliminated",
      (data: { username: string; players: Player[] }) => {
        setRoomData((prev) =>
          prev
            ? {
                ...prev,
                players: prev.players.map((p) =>
                  p.username === data.username ? { ...p, eliminated: true } : p,
                ),
              }
            : null,
        );
        toast.error(`${data.username} eliminated!`);
      },
    );

    newSocket.on(
      "gameOver",
      (data: { winners: Player[]; players: Player[]; reason: string }) => {
        setGameState((prev) => ({ ...prev, isPlaying: false }));
        setRoomData((prev) =>
          prev
            ? {
                ...prev,
                players: data.players,
              }
            : null,
        );
        toast.success(`Game Over: ${data.reason}`);
      },
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    roomData,
    gameState,
    gameHistory,
    createRoom: (username: string) => socket?.emit("createRoom", { username }),
    joinRoom: (lobbyId: string, username: string, userId: string) =>
      socket?.emit("joinRoom", { lobbyId, username, userId }),
    startGame: (roomId: string, userId: string) =>
      socket?.emit("startGame", { lobbyId: roomId, userId }),
    submitWord: (roomId: string, word: string, userId: string) =>
      socket?.emit("submitWord", { roomId, word, userId }),
  };
};
