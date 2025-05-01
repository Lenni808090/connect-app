import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";


import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const Client_Url = process.env.Client_Url
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: Client_Url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add this line
    allowedHeaders: ['Content-Type', 'Authorization'], // Add this line
}));



server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});



//API

app.use("/api/rooms", roomRoutes);