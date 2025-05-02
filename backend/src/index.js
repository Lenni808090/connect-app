import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";
import path from "path";
import { fileURLToPath } from "url";

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

// Add this after your existing routes
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});