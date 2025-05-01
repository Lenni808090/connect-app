import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import socket from '../utils/socket';

const GamePage = () => {
  const { roomId } = useParams();
  const { players, getPlayerNames } = useRoomStore();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (roomId) {
      getPlayerNames(roomId);

      socket.on('player_joined', () => {
        getPlayerNames(roomId);
      });

      socket.on('player_left', () => {
        getPlayerNames(roomId);
      });

      return () => {
        socket.off('player_joined');
        socket.off('player_left');
      };
    }
  }, [roomId, getPlayerNames]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div key={player.userId} className="relative">
            <div className="absolute -top-3 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
              {player.username}
            </div>
            <textarea
              className="w-full h-40 p-4 pt-6 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
              placeholder={`Type here...`}
              disabled={player.userId !== userId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
