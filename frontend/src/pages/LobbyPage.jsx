import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';
import socket from '../utils/socket';

const LobbyPage = () => {
  const { roomId } = useParams();
  const { players, getPlayerNames, leaveRoom, startGame, setCategories } = useRoomStore();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');
  const [categoriesSaved, setCategoriesSaved] = useState('');

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

  const handleCategoriesSubmit = () => {
    if (isHost && categoriesInput) {
      const categoriesArray = categoriesInput.split(',').map(cat => cat.trim());
      setCategories({
        roomId,
        categories: categoriesArray
      });
      setCategoriesSaved('Categories saved!');
      setTimeout(() => setCategoriesSaved(''), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6 animate-pulse">Lobby</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between transition-all duration-300">
              <h3 className="text-xl font-semibold">Room ID: {roomId}</h3>
              <button 
                onClick={copyRoomIdToClipboard}
                className="btn btn-primary btn-sm transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {copySuccess || 'Copy ID'}
              </button>
            </div>
            
            <div className="divider"></div>
            
            <h3 className="text-xl font-semibold">Spieler in der Lobby:</h3>
            <ul className="menu bg-base-200 rounded-box w-full">
              {players.map((player, index) => (
                <li 
                  key={player.userId}
                  className="flex items-center transition-all duration-300 hover:bg-base-300"
                  style={{
                    animation: `fadeInSlide 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex justify-between w-full px-4 py-2">
                    <span>{player.username}</span>
                    {player.isHost && (
                      <span className="badge badge-primary animate-bounce">Host</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            {isHost && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Kategorien (durch Kommas getrennt)"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleCategoriesSubmit}
                  className="btn btn-secondary w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Kategorien festlegen
                </button>
                {categoriesSaved && (
                  <div className="text-success text-center animate-fadeIn">
                    {categoriesSaved}
                  </div>
                )}
              </div>
            )}
            
            {isHost && (
              <button
                onClick={handleStartGame}
                className="btn btn-success w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Start Game
              </button>
            )}
            
            <button
              onClick={handleLeaveRoom}
              className="btn btn-error w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
