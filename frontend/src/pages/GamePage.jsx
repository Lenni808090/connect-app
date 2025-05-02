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
    nextRound,
    deleteRoom, // deleteRoom importieren
    resetRoomState // resetRoomState importieren
  } = useRoomStore();
  const userId = localStorage.getItem("userId");
  const [answer, setAnswer] = useState("");
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(() => {
    // Verwende eine spezifischere Prüfung für den Local Storage Key
    return localStorage.getItem(`submitted_${roomId}_${userId}`) === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Stelle sicher, dass room und room.scoreLimit existieren, bevor darauf zugegriffen wird
    if (room && room.scoreLimit && room.currentScore >= room.scoreLimit) {
      setShowWinAnimation(true);
      const animationDuration = 5000; // Dauer der Animation in ms

      const timer = setTimeout(async () => {
        setShowWinAnimation(false);

        // 1. Raum löschen (nur einmal, z.B. vom Host oder einfach vom Client, der die Bedingung zuerst erfüllt)
        //    Beachte: Dies könnte zu Race Conditions führen, wenn mehrere Clients gleichzeitig löschen.
        //    Eine robustere Lösung wäre, wenn der Server das Spielende feststellt und den Raum löscht.
        //    Für diese Implementierung löscht der Client, der die Animation sieht.
        try {
          await deleteRoom(roomId); // Backend-Aufruf zum Löschen
        } catch (error) {
           console.error("Fehler beim Löschen des Raums auf dem Client:", error);
           // Optional: Dem Benutzer eine Fehlermeldung anzeigen
        }

        // 2. Lokalen Zustand und Local Storage zurücksetzen
        resetRoomState(); // Zustand im Store zurücksetzen
        localStorage.removeItem(`submitted_${roomId}_${userId}`);
        // Füge hier ggf. weitere room-spezifische Local Storage Clears hinzu

        // 3. Zum Hauptmenü navigieren
        navigate('/', { replace: true });

      }, animationDuration);

      // Cleanup-Funktion für den Timer
      return () => clearTimeout(timer);
    }
  }, [room, roomId, userId, navigate, deleteRoom, resetRoomState]); // Abhängigkeiten aktualisiert

  useEffect(() => {
    if (roomId) {
      getRoom(roomId);
      getPlayerNames(roomId);
      checkIfHost(roomId, userId);

      const handlePlayerLeft = () => {
        getPlayerNames(roomId);
        // Reset submission status only if the game hasn't ended
        if (!showWinAnimation) {
           const currentSubmitted = localStorage.getItem(`submitted_${roomId}_${userId}`) === "true";
           setHasSubmitted(currentSubmitted);
        }
      };

      const handleRoundStarted = () => {
         getRoom(roomId);
         setHasSubmitted(false);
         localStorage.removeItem(`submitted_${roomId}_${userId}`); // Sicherstellen, dass es entfernt wird
         setAnswer("");
      };

      socket.on("player_left", handlePlayerLeft);
      socket.on("round_started", handleRoundStarted);

      return () => {
        socket.off("player_left", handlePlayerLeft);
        socket.off("round_started", handleRoundStarted);
        // Entferne andere Listener, falls nötig
      };
    }
  }, [roomId, userId, getPlayerNames, getRoom, checkIfHost, showWinAnimation]); // showWinAnimation hinzugefügt

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
      
      {/* Stelle sicher, dass die UI nicht gerendert wird, wenn die Animation läuft und auf Navigation gewartet wird */}
      {!showWinAnimation && room && (
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
             <div className="mt-8 flex justify-center gap-4 animate-fadeIn">
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
      )}
      {/* Fallback, wenn room noch nicht geladen ist oder die Animation läuft */}
       {(!room || showWinAnimation) && !showWinAnimation && (
         <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
         </div>
       )}
    </div>
  );
};

export default GamePage;
