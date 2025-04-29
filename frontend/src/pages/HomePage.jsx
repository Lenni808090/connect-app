import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { useRoomStore } from "../store/useRoomStore.js";
import { useEffect } from "react";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [inputRoomId, setInputRoomId] = useState(""); // Korrigierte Benennung
  const navigate = useNavigate();
  const { createRoom, joinRoom, success, roomId } = useRoomStore();

  useEffect(() => {
    if (success && roomId) {
      socket.emit("join_room", roomId);
      navigate(`/lobby/${roomId}`);
    }
  }, [success, roomId, navigate]);

  const handleCreateRoom = async () => {
    if (!username) {
      alert("Bitte geben Sie einen Benutzernamen ein");
      return;
    }
    await createRoom({ username, socketId: socket.id });
  };

  const handleJoinRoom = async () => {
    if (!username || !inputRoomId) {
      alert("Bitte geben Sie einen Benutzernamen und eine Room-ID ein");
      return;
    }

    await joinRoom({
      username,
      roomId: inputRoomId,
      socketId: socket.id,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Willkommen!</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Dein Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Neuen Raum erstellen
            </button>

            <div className="text-center">oder</div>

            <input
              type="text"
              placeholder="Room ID eingeben"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Raum beitreten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
