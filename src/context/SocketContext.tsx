"use client";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface Player {
	id: string;
	username: string;
	score: number;
	isCurrentPlayer: boolean;
	inactive?: boolean;
	eliminated?: boolean;
	socketId?: string;
	position?: number;
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
	ruleRepeatCount: number;
	requiredRepeats: number;
}

export interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	roomData: RoomData | null;
	gameState: GameState;
	gameHistory: Array<{
		player: string;
		word: string;
		points: number;
		timestamp: number;
	}>;
	createRoom: (username: string) => void;
	joinRoom: (lobbyId: string, username: string, userId: string) => void;
	startGame: (roomId: string, userId: string) => void;
	submitWord: (roomId: string, word: string, userId: string) => void;
	showGameOver: boolean;
	setShowGameOver: (show: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [roomData, setRoomData] = useState<RoomData | null>(null);
	const [gameState, setGameState] = useState<GameState>({
		isPlaying: false,
		currentRule: "",
		timeLeft: 0,
		minWordLength: 4,
		currentPlayer: "",
		ruleRepeatCount: 0,
		requiredRepeats: 2,
	});
	const [gameHistory, setGameHistory] = useState<
		Array<{
			player: string;
			word: string;
			points: number;
			timestamp: number;
		}>
	>([]);
	const [showGameOver, setShowGameOver] = useState(false);

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
				ruleRepeatCount: 0,
				requiredRepeats: 2,
			});
		});

		newSocket.on("roomJoined", (data: RoomData) => {
			setRoomData(data);
		});

		newSocket.on("playerJoined", (data: RoomData) => {
			setRoomData(data);
			toast.info("New player joined");
		});

		newSocket.on("gameStarted", (data: RoomData & GameState) => {
			setGameState({
				isPlaying: true,
				currentRule: data.currentRule || "",
				timeLeft: data.timeLimit || 0,
				minWordLength: data.minWordLength || 4,
				currentPlayer:
					data.players.find((p) => p.isCurrentPlayer)?.username || "",
				ruleRepeatCount: data.ruleRepeatCount || 0,
				requiredRepeats: data.requiredRepeats || 2,
			});
			setRoomData(data);
			toast.success("Game started! Follow the rules shown above.", {
				position: "top-right",
			});
		});

		newSocket.on("playerStatusUpdate", (data: { players: Player[] }) => {
			console.log("update player status ");
			setRoomData((prev) =>
				prev ? { ...prev, players: data.players } : null
			);
		});

		newSocket.on("turnTimedOut", (data) => {
			setGameState((prev) => ({
				...prev,
				currentPlayer: data.nextPlayer,
				timeLeft: data.timeLeft,
			}));
			toast.error(`Time's up! Turn passed to ${data.nextPlayer}`);
		});

		newSocket.on(
			"timeUpdate",
			(data: { timeLeft: number; currentPlayer: string }) => {
				setGameState((prev) => ({
					...prev,
					timeLeft: data.timeLeft,
					currentPlayer: data.currentPlayer,
				}));
			}
		);

		newSocket.on(
			"wordSubmitted",
			(data: {
				players: Player[];
				word: string;
				points: number;
				currentRule: string;
				currentPlayer: string;
				ruleRepeatCount: number;
				requiredRepeats: number;
				player: Player;
			}) => {
				setGameHistory((prev) => [
					{
						player: data.player.username,
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
								players: data.players.map((p) => ({
									...p,
									eliminated: p.eliminated || false,
									inactive: p.inactive || false,
								})),
						  }
						: null
				);

				setGameState((prev) => ({
					...prev,
					currentRule: data.currentRule,
					currentPlayer: data.currentPlayer,
					ruleRepeatCount: data.ruleRepeatCount,
					requiredRepeats: data.requiredRepeats,
				}));
			}
		);

		newSocket.on("wordRejected", (data: { reason: string }) => {
			toast.error(`Word rejected: ${data.reason}`, {
				position: "top-right",
			});
		});

		newSocket.on("gamePaused", (data: { reason: string }) => {
			setGameState((prev) => ({ ...prev, isPlaying: false }));
			toast.info(`Game paused: ${data.reason}`, {
				position: "top-right",
			});
		});

		newSocket.on(
			"playerEliminated",
			(data: { username: string; players: Player[] }) => {
				setRoomData((prev) =>
					prev ? { ...prev, players: data.players } : null
				);
				toast.error(`${data.username} has been eliminated!`);
			}
		);

		newSocket.on(
			"gameOver",
			(data: {
				winners: Player[];
				players: Player[];
				reason: string;
			}) => {
				console.log("from socket", data.players);
				setGameState((prev) => ({ ...prev, isPlaying: false }));
				setRoomData((prev) =>
					prev
						? {
								...prev,
								players: data.players,
						  }
						: null
				);
				setShowGameOver(true);
				toast.success(`Game Over: ${data.reason}`);
			}
		);

		newSocket.on("roomInfo", (data: RoomData & GameState) => {
			setGameState({
				isPlaying: data.isPlaying,
				currentRule: data.currentRule || "",
				timeLeft: data.timeLeft || 0,
				minWordLength: data.minWordLength || 4,
				currentPlayer: data.currentPlayer || "",
				ruleRepeatCount: data.ruleRepeatCount || 0,
				requiredRepeats: data.requiredRepeats || 2,
			});
			setRoomData(data);
		});

		return () => {
			newSocket.disconnect();
		};
	}, []);

	const createRoom = (username: string) => {
		socket?.emit("createRoom", { username });
	};

	const joinRoom = (lobbyId: string, username: string, userId: string) => {
		socket?.emit("joinRoom", { lobbyId, username, userId });
	};

	const startGame = (roomId: string, userId: string) => {
		socket?.emit("startGame", { lobbyId: roomId, userId });
	};

	const submitWord = (roomId: string, word: string, userId: string) => {
		socket?.emit("submitWord", { roomId, word, userId });
	};
	// useEffect(() => {
	//   console.log(roomData);
	// }, [roomData]);

	return (
		<SocketContext.Provider
			value={{
				socket,
				isConnected,
				roomData,
				gameState,
				gameHistory,
				createRoom,
				joinRoom,
				startGame,
				submitWord,
				showGameOver,
				setShowGameOver,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => {
	const context = useContext(SocketContext);
	if (!context)
		throw new Error("useSocketContext must be used within SocketProvider");
	return context;
};
