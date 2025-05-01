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

if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: "./config/.env",
    });
  }
  
  const corsConfig = {
    origin: process.env.Client_URL,
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  };
  
  app.options("", cors(corsConfig));
  app.use(cors(corsConfig));


server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});



//API

app.use("/api/rooms", roomRoutes);