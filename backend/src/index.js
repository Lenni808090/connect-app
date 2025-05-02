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
// Configure CORS to allow specific origin when credentials are included
app.use(cors({
  origin: "https://connect-app-frontend.onrender.com", // Specify your frontend origin
  credentials: true, // Keep this as your frontend sends credentials
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

server.listen(PORT, '0.0.0.0', () => { // Add '0.0.0.0' here
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});