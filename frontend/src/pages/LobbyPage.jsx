import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import socket from '../utils/socket';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { players, getPlayerNames } = useRoomStore();

  useEffect(() => {
    if (roomId) {
      getPlayerNames(roomId);

      socket.on('player_joined', () => {
        getPlayerNames(roomId);
      });

      return () => {
        socket.off('player_joined');
      };
    }
  }, [roomId, getPlayerNames]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Lobby</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Spieler in der Lobby:</h3>
          <ul className="space-y-2">
            {players.map((player) => (
              <li 
                key={player.socketId}
                className="p-2 bg-gray-50 rounded flex items-center"
              >
                <span className="flex-1">{player.username}</span>
                {player.isHost && (
                  <span className="text-sm text-blue-500">(Host)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
