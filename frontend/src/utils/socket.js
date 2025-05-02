import { io } from "socket.io-client";

const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

const socket = io(isProduction
    ? "https://connect-app-d495.onrender.com"  // Updated URL
    : "http://localhost:5001", {
  withCredentials: true,
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

socket.on("connect", () => {
  console.log("Socket connected successfully");
  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("register_user", userId);
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;