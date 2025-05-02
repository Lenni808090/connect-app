import { Server } from "socket.io";
import http from "http";
import express from "express";

import Room from "../models/room.model.js";

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://connect-app-frontend.onrender.com", // Change wildcard to your specific frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true // Keep this true as your frontend uses it
  },
});

const socketToUserMap = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("register_user", (userId) => {
    socketToUserMap.set(socket.id, userId);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log("a user joined room", roomId);
    const room = await Room.findOne({ roomId });
    if (room) {
      io.to(roomId).emit("player_joined", { players: room.players });
    }
  });

  socket.on("start_game", async (roomId) => {
    console.log("Game started in room", roomId);
    io.to(roomId).emit("game_started", { roomId });
  });

  socket.on("next_round", async (roomId) => {
    console.log("next round started in room", roomId);
    io.to(roomId).emit("round_started", { roomId });
  });

  socket.on("leave_room", async (roomId) => {
    io.to(roomId).emit("player_left");
  });

  socket.on("disconnect", () => {
    socketToUserMap.delete(socket.id);
    console.log("user disconnected");
  });
});

export const getUserId = (socketId) => {
  return socketToUserMap.get(socketId);
};

export { app, io, server };
