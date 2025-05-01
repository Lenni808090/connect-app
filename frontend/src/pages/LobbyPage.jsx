import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import socket from '../utils/socket';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { players, getPlayerNames, leaveRoom , startGame} = useRoomStore();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState('');
  

  const userId = localStorage.getItem('userId');
  const currentPlayer = players.find(player => player.userId === userId);
  const isHost = currentPlayer?.isHost || false;

  useEffect(() => {
    if (roomId) {
      socket.emit('join_room', roomId);
      getPlayerNames(roomId);

      socket.on('player_joined', () => {
        getPlayerNames(roomId);
      });

      socket.on('player_left', () => {
        getPlayerNames(roomId);
      });

      socket.on('game_started', () => {
        navigate(`/game/${roomId}`, { replace: true });
      });

      return () => {
        socket.off('player_joined');
        socket.off('player_left');
        socket.off('game_started');
      };
    }
  }, [roomId, getPlayerNames, navigate]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom({
        roomId,
        userId,
      });
      socket.emit('leave_room', roomId);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleStartGame = () => {
    if (isHost) {
      socket.emit('start_game', roomId);
      startGame({roomId});
    }
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy room ID: ', err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Lobby</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Room ID: {roomId}</h3>
            <button 
              onClick={copyRoomIdToClipboard}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              {copySuccess || 'Copy ID'}
            </button>
          </div>
          
          <h3 className="text-xl font-semibold">Spieler in der Lobby:</h3>
          <ul className="space-y-2">
            {players.map((player) => (
              <li 
                key={player.userId}
                className="p-2 bg-gray-50 rounded flex items-center"
              >
                <span className="flex-1">{player.username}</span>
                {player.isHost && (
                  <span className="text-sm text-blue-500">(Host)</span>
                )}
              </li>
            ))}
          </ul>
          
          {isHost && (
            <button
              onClick={handleStartGame}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Start Game
            </button>
          )}
          
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
