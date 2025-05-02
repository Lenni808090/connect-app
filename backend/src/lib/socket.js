import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors"; // Add this import
import Room from "../models/room.model.js";

const app = express();

// Add CORS middleware to Express
app.use(cors({
  origin: "*", // Or specify your frontend URL: "https://connect-app-khaki.vercel.app"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allows all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
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

export { io, server, app };
