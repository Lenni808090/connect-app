import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
  origin: "https://connect-app-frontend.onrender.com",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/rooms", roomRoutes);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});