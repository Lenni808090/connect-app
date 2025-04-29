import { useState, useEffect } from 'react';
import socket from '../utils/socket';

function Lobby({ roomId, username, isHost }) {
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState(['Tiere', 'Essen', 'Städte', 'Berufe', 'Sport']);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Hier Socket-Events für Spieler-Updates einrichten
    socket.on('player_joined', (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off('player_joined');
    };
  }, []);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleStartGame = async () => {
    try {
      // Kategorien setzen, falls ausgewählt
      if (selectedCategories.length > 0) {
        await fetch('http://localhost:5001/api/rooms/setCategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId,
            categories: selectedCategories
          }),
        });
      }

      // Spiel starten
      const response = await fetch('http://localhost:5001/api/rooms/startGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        socket.emit('game_started', { roomId });
      }
    } catch (error) {
      console.error('Fehler beim Starten des Spiels:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Lobby: {roomId}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Spieler:</h3>
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li key={index} className="flex items-center">
              <span>{player.username}</span>
              {player.isHost && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Host</span>}
            </li>
          ))}
        </ul>
      </div>

      {isHost && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Kategorien auswählen:</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded text-purple-600"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={players.length < 2}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              players.length < 2
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Spiel starten
          </button>
          {players.length < 2 && (
            <p className="text-sm text-red-500 mt-2">Mindestens 2 Spieler werden benötigt</p>
          )}
        </>
      )}

      {!isHost && (
        <p className="text-center text-gray-600">Warte auf den Host, um das Spiel zu starten...</p>
      )}
    </div>
  );
}

export default Lobby;