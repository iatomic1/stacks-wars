"use client";
import { useSocketContext } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { truncateAddress } from "@/lib/utils";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import LexiWarsMultiplayer from "./lexi-wars-multiplayer";
import { useRouter } from "next/navigation";
import { Participant } from "@/types/schema";

export default function Content({
	id,
	participants,
}: {
	id: string;
	participants: Participant[];
}) {
	const { joinRoom, roomData, socket } = useSocketContext();
	const { user } = useUser();
	const hasJoinedRef = useRef(false);
	const router = useRouter();

	const handleJoin = useCallback(async () => {
		if (!user?.id) {
			toast.error("Connect your wallet first");
			return false;
		}

		const isParticipant = participants.some((p) => p.userId === user.id);

		if (!isParticipant) {
			toast.error("You are not a member of this lobby");
			router.replace("/lobby");
			return false;
		}

		joinRoom(id, truncateAddress(user.stxAddress), user?.id);
		return true;
	}, [user, id, joinRoom, router, participants]);

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
