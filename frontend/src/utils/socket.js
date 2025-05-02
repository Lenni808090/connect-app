import { io } from "socket.io-client";


const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

const socket = io(isProduction 
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