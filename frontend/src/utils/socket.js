import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

// Beim Verbindungsaufbau die UUID aus dem localStorage senden
socket.on("connect", () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        socket.emit("register_user", userId);
    }
});

export default socket;