import { Participant } from "@/types/schema";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Player {
	username: string;
	score: number;
	isCurrentPlayer: boolean;
}

export interface RoomData {
	roomId: string;
	roomCode: string;
	players: Player[];
}

export const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [roomData, setRoomData] = useState<RoomData | null>(null);
	const [gameInProgress, setGameInProgress] = useState(false);

	useEffect(() => {
		const newSocket = io("http://localhost:3002", {
			transports: ["websocket"],
		});
		setSocket(newSocket);

		newSocket.on("connect", () => {
			setIsConnected(true);
			console.log("connected");
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
			setRoomData(null);
			setGameInProgress(false);
		});

		newSocket.on("error", (data: { message: string }) => {
			toast.error(data.message);
		});

		// Room creation events
		newSocket.on("roomCreated", (data) => {
			setRoomData({
				roomId: data.roomId,
				roomCode: data.roomCode,
				players: data.players,
			});
			toast.success(`Room created with code: ${data.roomCode}`);
		});

		// Player events
		newSocket.on("playerJoined", (data) => {
			setRoomData({
				roomId: data.roomId,
				roomCode: data.roomCode,
				players: data.players,
			});
			toast.info(`New player joined the room`);
		});

		newSocket.on("playerInactive", (data) => {
			setRoomData((prev) =>
				prev
					? {
							...prev,
							players: data.players,
					  }
					: null
			);
			toast.info(`${data.username} disconnected`);
		});

		// Game state events
		newSocket.on("gameStarted", () => {
			setGameInProgress(true);
		});

		newSocket.on("gamePaused", () => {
			setGameInProgress(false);
		});

		// When word is submitted, update player scores and current player
		newSocket.on("wordSubmitted", (data) => {
			setRoomData((prev) => {
				if (!prev) return null;
				// Update player scores and current player status
				return {
					...prev,
					players: data.players.map((player: Participant) => ({
						...player,
						isCurrentPlayer: player.username === data.currentPlayer,
					})),
				};
			});
		});

		// Also update on timeUpdate events
		newSocket.on("timeUpdate", (data) => {
			if (data.currentPlayer) {
				setRoomData((prev) => {
					if (!prev) return null;
					return {
						...prev,
						players: prev.players.map((player) => ({
							...player,
							isCurrentPlayer:
								player.username === data.currentPlayer,
						})),
					};
				});
			}
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	const createRoom = (username: string) => {
		if (!socket) {
			toast.error("Socket connection not established.");
			return;
		}
		socket.emit("createRoom", { username });
	};

	const joinRoom = (lobbyId: string, username: string) => {
		if (!socket) {
			toast.error("Socket connection not established.");
			return;
		}
		socket.emit("joinRoom", { lobbyId, username });
	};

	const startGame = (roomId: string) => {
		if (!socket) {
			toast.error("Socket connection not established.");
			return;
		}
		socket.emit("startGame", roomId);
	};

	const submitWord = (roomId: string, word: string) => {
		if (!socket) {
			toast.error("Socket connection not established.");
			return;
		}
		socket.emit("submitWord", { roomId, word });
	};

	return {
		socket,
		isConnected,
		roomData,
		gameInProgress,
		createRoom,
		joinRoom,
		startGame,
		submitWord,
	};
};
