

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Room from "../models/room.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
});

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("join_room", async (roomId) => {
        socket.join(roomId);
        console.log("a user joined room", roomId)
        const room = await Room.findOne({ roomId });
        if (room) {
            io.to(roomId).emit('player_joined', { players: room.players });
        }
    });

    socket.on("start_game", async (roomId) => {
        console.log("Game started in room", roomId);
        // Benachrichtige alle Spieler im Raum, dass das Spiel gestartet wurde
        io.to(roomId).emit('game_started', { roomId });
        
        const room = await Room.findOne({ roomId });
        if (room) {
            io.to(roomId).emit('game_update', {
                gameState: room.gameState,
                currentCategory: room.currentCategory,
                submissions: room.submissions,
                currentScore: room.currentScore,
                round: room.round
            });
        }
    });

    socket.on("word_submitted", async ({ roomId }) => {
        const room = await Room.findOne({ roomId });
        if (room) {
            io.to(roomId).emit('game_update', {
                gameState: room.gameState,
                currentCategory: room.currentCategory,
                submissions: room.submissions,
                currentScore: room.currentScore,
                round: room.round
            });
        }
    });

    socket.on("round_ended", async ({ roomId }) => {
        const room = await Room.findOne({ roomId });
        if (room) {
            io.to(roomId).emit('game_update', {
                gameState: room.gameState,
                currentCategory: room.currentCategory,
                submissions: room.submissions,
                currentScore: room.currentScore,
                round: room.round
            });
        }
    });

    socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

export { io, server, app };
