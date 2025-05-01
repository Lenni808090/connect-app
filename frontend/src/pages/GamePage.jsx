import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../store/useRoomStore";
import socket from "../utils/socket";

const GamePage = () => {
  const { roomId } = useParams();
  const {
    players,
    getPlayerNames,
    getRoom,
    room,
    submitWord,
    checkIfHost,
    isHost,
    voting
  } = useRoomStore();
  const userId = localStorage.getItem("userId");
  const [answer, setAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(() => {
    return localStorage.getItem(`submitted_${roomId}_${userId}`) === "true";
  });

  useEffect(() => {
    if (roomId) {
      getRoom(roomId);
      getPlayerNames(roomId);
      checkIfHost(roomId, userId); // Korrekter Aufruf mit beiden Parametern

      socket.on("player_left", () => {
        getPlayerNames(roomId);
      });

      return () => {
        socket.off("player_joined");
        socket.off("player_left");
      };
    }
  }, [roomId, getPlayerNames, getRoom, room, userId, checkIfHost]);

  const handleTextChange = (value) => {
    if (!hasSubmitted) {
      setAnswer(value);
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert("Please enter a word before submitting");
      return;
    }
    const word = answer.trim();
    submitWord({ roomId, userId, word });
    setHasSubmitted(true);
    localStorage.setItem(`submitted_${roomId}_${userId}`, "true");
  };

  const handleAcceptVotes = () => {
    const decision = {
      roomId: roomId,
      decision: true,
    }

    voting(decision);
  };

  const handleRejectVotes = () => {
    const decision = {
      roomId: roomId,
      decision: false,
    }

    voting(decision);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>{room?.currentCategory}</div>
        <div>{room?.gameState === "voting" ? "voting" : "nix voting"}</div>
        <div>{room?.currentScore}</div>
        {players.map((player) => (
          <div key={player.userId} className="relative">
            <div className="absolute -top-3 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
              {player.username}
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full h-40 p-4 pt-6 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                placeholder={`${
                  player.userId !== userId ? "Warten auf antwort" : "Hier schreiben"
                }`}
                disabled={player.userId !== userId || hasSubmitted}
                value={player.userId === userId ? answer : room?.gameState === "voting" 
                  ? room?.submissions?.find(sub => sub.userId === player.userId)?.word || ""
                  : ""}
                onChange={(e) => handleTextChange(e.target.value)}
              />
              {player.userId === userId && room?.gameState !== "voting" && (
                <button
                  onClick={handleSubmit}
                  disabled={hasSubmitted}
                  className={`${
                    hasSubmitted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        ))}
        {isHost && room?.gameState === "voting" && (
          <div className="flex gap-2">
            <button
              onClick={handleAcceptVotes}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex-1"
            >
              Akzeptieren
            </button>
            <button
              onClick={handleRejectVotes}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex-1"
            >
              Ablehnen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
