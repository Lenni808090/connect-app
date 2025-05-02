import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import the cors package
import roomRoutes from "./routes/room.routes.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

// Configure CORS to allow all origins (USE WITH CAUTION!)
// This allows requests from any domain.
// It's generally recommended to specify allowed origins for security.
app.use(cors({
  origin: "*", // Allow any origin
  credentials: true, // Keep this if you need cookies/authorization headers
}));

// // Previous specific origin configuration (commented out or removed)
// const corsOptions = {
//   origin: "https://connect-app-khaki.vercel.app", // Allow your frontend origin
//   credentials: true, // Allow cookies to be sent with requests (if needed)
// };
// app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// API
app.use("/api/rooms", roomRoutes);

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});