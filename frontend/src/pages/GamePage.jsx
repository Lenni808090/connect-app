import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoomStore } from "../store/useRoomStore";
import socket from "../utils/socket";
import '../styles/WinAnimation.css';

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
    voting,
    nextRound
  } = useRoomStore();
  const userId = localStorage.getItem("userId");
  const [answer, setAnswer] = useState("");
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(() => {
    return localStorage.getItem(`submitted_${roomId}_${userId}`) === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (room?.currentScore >= room?.scoreLimit) {
      setShowWinAnimation(true);
      // Raum löschen und zur Homepage navigieren nach 5 Sekunden
      setTimeout(async () => {
        setShowWinAnimation(false);
        await useRoomStore.getState().deleteRoom(roomId);
        socket.emit('leave_room', roomId);
        navigate('/', { replace: true });
      }, 5000);
    }
  }, [room?.currentScore, room?.scoreLimit, navigate, roomId]);

  useEffect(() => {
    if (roomId) {
      getRoom(roomId);
      getPlayerNames(roomId);
      checkIfHost(roomId, userId);

      socket.on("player_left", () => {
        getPlayerNames(roomId);
        localStorage.setItem(`submitted_${roomId}_${userId}`, "false");
        setHasSubmitted(localStorage.getItem(`submitted_${roomId}_${userId}`) === "true");
      });

      socket.on("round_started", () => {
        getRoom(roomId);
        setHasSubmitted(false);
        localStorage.setItem(`submitted_${roomId}_${userId}`, "false");
        setAnswer("");
      });

      return () => {
        socket.off("player_left");
        socket.off("update_submissions");
        socket.off("round_started");
      };
    }
  }, [roomId, userId, getPlayerNames, getRoom, checkIfHost, room]);

  const handleTextChange = (value) => {
    if (!hasSubmitted) {
      setAnswer(value);
    }
  };

  const handleSubmit = () => {
    if (players.length < 2) {
      alert("Das Spiel kann nur mit mindestens 2 Spielern gestartet werden.");
      return;
    }

    if (!answer.trim()) {
      alert("Bitte geben Sie ein Wort ein, bevor Sie abschicken.");
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
    nextRound({roomId});
    setAnswer("")
    setHasSubmitted(false);
    localStorage.setItem(`submitted_${roomId}_${userId}`, "false");
    socket.emit('next_round', roomId);
  };

  const handleRejectVotes = () => {
    const decision = {
      roomId: roomId,
      decision: false,
    }

    voting(decision);
    nextRound({roomId});
    setAnswer("")
    setHasSubmitted(false);
    localStorage.setItem(`submitted_${roomId}_${userId}`, "false");
    socket.emit('next_round', roomId);
  };

  return (
    <div className="min-h-screen p-8 bg-base-200 transition-all duration-300">
      {showWinAnimation && (
        <div className="win-overlay">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="confetti confetti-1">🎊</div>
            <div className="confetti confetti-2">🎉</div>
            <div className="confetti confetti-3">🎊</div>
            <div className="confetti confetti-4">🎉</div>
            <div className="confetti confetti-5">🎊</div>
            
            <div className="win-card">
              <div className="relative">
                <h1 className="win-title">
                  🏆 GEWONNEN! 🏆
                </h1>
                <p className="win-subtitle">
                  Herzlichen Glückwunsch!
                </p>
                <p className="win-message">
                  Ihr habt das Spiel erfolgreich abgeschlossen!
                </p>
                
                <div className="star star-1">⭐</div>
                <div className="star star-2">⭐</div>
                <div className="star star-3">⭐</div>
                <div className="star star-4">⭐</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto">
        <div className="stats shadow mb-8 w-full animate-fadeIn">
          <div className="stat transition-all duration-300 hover:bg-base-200">
            <div className="stat-title">Aktuelle Kategorie</div>
            <div className="stat-value text-primary animate-pulse">{room?.currentCategory}</div>
          </div>
          <div className="stat transition-all duration-300 hover:bg-base-200">
            <div className="stat-title">Spielstatus</div>
            <div className="stat-value">{room?.gameState === "voting" ? "Abstimmung" : "Spielphase"}</div>
          </div>
          <div className="stat transition-all duration-300 hover:bg-base-200">
            <div className="stat-title">Punktestand</div>
            <div className="stat-value text-secondary">{room?.currentScore}/{room?.scoreLimit}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player, index) => (
            <div 
              key={player.userId} 
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animation: `fadeInSlide 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="card-body">
                <h2 className="card-title">
                  {player.username}
                  {player.isHost && (
                    <div className="badge badge-primary animate-bounce">Host</div>
                  )}
                </h2>
                <textarea
                  className="textarea textarea-bordered h-40 w-full resize-none transition-all duration-300 focus:ring-2 focus:ring-primary"
                  placeholder={`${
                    player.userId !== userId ? "Warten auf Antwort" : "Hier schreiben"
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
                    className={`btn ${
                      hasSubmitted
                        ? "btn-disabled"
                        : "btn-primary"
                    } transition-all duration-300 transform hover:scale-105 active:scale-95`}
                  >
                    Antwort abschicken
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isHost && room?.gameState === "voting" && (
          <div className="flex gap-4 mt-8 animate-slideUp">
            <button
              onClick={handleAcceptVotes}
              className="btn btn-success flex-1 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Akzeptieren
            </button>
            <button
              onClick={handleRejectVotes}
              className="btn btn-error flex-1 transition-all duration-300 transform hover:scale-105 active:scale-95"
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
