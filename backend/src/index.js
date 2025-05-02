import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: "*",
    allowedHeaders: "*"
}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});

// API
app.use("/api/rooms", roomRoutes);