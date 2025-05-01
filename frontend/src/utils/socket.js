import { io } from "socket.io-client";

const socket = io(import.meta.env.NODE_ENV === 'production' 
    ? "https://connect-app-api.vercel.app" 
    : "http://localhost:5001", {
  withCredentials: true,
  autoConnect: false
});

socket.on("connect", () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("register_user", userId);
  }
});

export default socket;