"use client";
import { useSocketContext } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { truncateAddress } from "@/lib/utils";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import LexiWarsMultiplayer from "./lexi-wars-multiplayer";

export default function Content({ id }: { id: string }) {
	const { joinRoom, roomData, socket } = useSocketContext();
	const { user } = useUser();
	const hasJoinedRef = useRef(false);

	const handleJoin = useCallback(() => {
		if (!user?.id) {
			toast.error("Connect your wallet first");
			return false;
		}

		joinRoom(id, truncateAddress(user.stxAddress), user?.id);
		return true;
	}, [user, id, joinRoom]);

	useEffect(() => {
		if (socket && user?.id && !hasJoinedRef.current) {
			const joinSuccess = handleJoin();
			if (joinSuccess) {
				hasJoinedRef.current = true;
			}
		}
	}, [socket, user, handleJoin]);

	useEffect(() => {
		if (!socket) {
			hasJoinedRef.current = false;
		}
	}, [socket]);

	if (roomData && socket && user) {
		return (
			<div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
				<LexiWarsMultiplayer
					username={truncateAddress(user.stxAddress)}
					user={user}
					id={id}
				/>
			</div>
		);
	}

	return <p>Loading game...</p>;
}
