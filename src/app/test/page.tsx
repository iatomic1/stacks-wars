"use client";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("invalidWord", () => {
      toast.error("Invalid word! Try again.");
    });

    return () => {
      socket.off("roomCreated");
      socket.off("playerJoined");
      socket.off("turnUpdate");
      socket.off("wordSubmitted");
      socket.off("gameOver");
      socket.off("invalidWord");
    };
  }, [socket]);

  return <div></div>;
}
