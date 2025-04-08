"use client";
import { useSocketContext } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { truncateAddress } from "@/lib/utils";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import LexiWarsMultiplayer from "./lexi-wars-multiplayer";
import { useRouter } from "next/navigation";

export default function Content({ id }: { id: string }) {
	const { joinRoom, roomData, socket } = useSocketContext();
	const { user } = useUser();
	const hasJoinedRef = useRef(false);
	const router = useRouter();

	const handleJoin = useCallback(async () => {
		if (!user?.id) {
			toast.error("Connect your wallet first");
			return false;
		}

		try {
			// Make a server action call to check participation
			const response = await fetch(
				`/api/lobby/${id}/check-participant?userId=${user.id}`
			);
			const data = await response.json();

			if (!data.isParticipant) {
				toast.error("You are not a member of this lobby");
				router.replace("/lobby");
				return false;
			}

			joinRoom(id, truncateAddress(user.stxAddress), user?.id);
			return true;
		} catch (error) {
			console.error("Error checking participant:", error);
			toast.error("Failed to verify lobby membership");
			router.replace("/lobby");
			return false;
		}
	}, [user, id, joinRoom, router]);

	useEffect(() => {
		if (socket && user?.id && !hasJoinedRef.current) {
			const checkAndJoin = async () => {
				const joinSuccess = await handleJoin();
				if (joinSuccess) {
					hasJoinedRef.current = true;
				}
			};
			checkAndJoin();
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
