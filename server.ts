// import { parse } from "node:url";
// import { nanoid } from "nanoid";
// import { createServer } from "node:http";
// import next from "next";
// import { Server as SocketIOServer } from "socket.io";
// import { GameRoom } from "./src/lib/lexi/gameRoom";
//
// const dev = process.env.NODE_ENV !== "production";
// const nextApp = next({ dev });
// const handle = nextApp.getRequestHandler();
// const port = process.env.PORT || 3000;
//
// nextApp
//   .prepare()
//   .then(() => {
//     const server = createServer((req, res) => {
//       handle(req, res, parse(req.url || "", true));
//     });
//
//     // Initialize Socket.io
//     const io = new SocketIOServer(server, {
//       cors: {
//         origin: dev ? "*" : ["https://your-frontend-domain.com"], // Adjust for production
//         methods: ["GET", "POST"],
//       },
//     });
//
//     const rooms = new Map<string, GameRoom>();
//
//     io.on("connection", (socket) => {
//       console.log("A user connected:", socket.id);
//
//       socket.on("createRoom", (username: string) => {
//         const roomId = nanoid(8);
//         const room = new GameRoom(roomId);
//         room.addPlayer(socket.id, username);
//         rooms.set(roomId, room);
//
//         socket.join(roomId);
//         socket.emit("roomCreated", roomId);
//         io.to(roomId).emit("playerJoined", room.players);
//       });
//
//       socket.on("joinRoom", (roomId: string, username: string) => {
//         const room = rooms.get(roomId);
//         if (!room) {
//           socket.emit("roomNotFound");
//           return;
//         }
//
//         room.addPlayer(socket.id, username);
//         socket.join(roomId);
//         io.to(roomId).emit("playerJoined", room.players);
//       });
//
//       socket.on("submitWord", (roomId: string, word: string) => {
//         const room = rooms.get(roomId);
//         if (!room || room.getCurrentPlayer().id !== socket.id) return;
//
//         const isValid = room.submitWord(socket.id, word);
//         if (isValid) {
//           io.to(roomId).emit("wordSubmitted", { playerId: socket.id, word });
//           if (room.checkGameOver()) {
//             io.to(roomId).emit("gameOver", room.players);
//           } else {
//             room.endTurn();
//             io.to(roomId).emit("turnUpdate", room.getCurrentPlayer());
//           }
//         } else {
//           socket.emit("invalidWord");
//         }
//       });
//
//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//         rooms.forEach((room) => {
//           room.removePlayer(socket.id);
//           io.to(room.id).emit("playerLeft", socket.id);
//         });
//       });
//     });
//
//     server.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Error starting server:", err);
//     process.exit(1);
//   });
