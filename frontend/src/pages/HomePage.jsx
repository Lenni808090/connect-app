import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { useRoomStore } from "../store/useRoomStore.js";
import { v4 as uuidv4 } from 'uuid';

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
    // Beim ersten Laden eine UUID generieren und speichern
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuidv4());
    }
  }, [success, roomId, navigate]);

  const handleCreateRoom = async () => {
    if (!username) {
      alert("Bitte geben Sie einen Benutzernamen ein");
      return;
    }
    const userId = localStorage.getItem('userId');
    await createRoom({ username, userId });
  };

  const handleJoinRoom = async () => {
    if (!username || !inputRoomId) {
      alert("Bitte geben Sie einen Benutzernamen und eine Room-ID ein");
      return;
    }
    const userId = localStorage.getItem('userId');
    await joinRoom({
      username,
      roomId: inputRoomId,
      userId,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold text-center mb-6 animate-pulse">Willkommen!</h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Dein Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
            />

            <div className="flex flex-col gap-4">
              <button
                onClick={handleCreateRoom}
                className="btn btn-primary w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Neuen Raum erstellen
              </button>

              <div className="divider">oder</div>

              <input
                type="text"
                placeholder="Room ID eingeben"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
              />

              <button
                onClick={handleJoinRoom}
                className="btn btn-secondary w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Raum beitreten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
