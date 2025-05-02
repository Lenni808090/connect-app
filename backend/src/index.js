import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import roomRoutes from "./routes/room.routes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

// API
app.use("/api/rooms", roomRoutes);

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});