import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import socket from '../utils/socket';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { players, getPlayerNames, leaveRoom } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      // Initial fetch of players
      getPlayerNames(roomId);

      // Set up socket listeners
      socket.on('player_joined', () => {
        getPlayerNames(roomId);
      });

      socket.on('player_left', () => {
        getPlayerNames(roomId);
      });

      // Set up periodic refresh
      const intervalId = setInterval(() => {
        getPlayerNames(roomId);
      }, 3000); // Refresh every 3 seconds

      return () => {
        socket.off('player_joined');
        socket.off('player_left');
        clearInterval(intervalId);
      };
    }
  }, [roomId, getPlayerNames]);

  const handleLeaveRoom = async () => {
    try {
      socket.emit('leave_room', roomId);

      await leaveRoom({
        roomId,
        socketId: socket.id,
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

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
          
          <button
            onClick={handleLeaveRoom}
            className="w-full mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
