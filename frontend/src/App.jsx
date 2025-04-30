import socket from './utils/socket'
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from "./pages/GamePage"
import { useEffect } from "react";
const App = () => {

  useEffect(() => {
    socket.connect();
    
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/lobby/:roomId' element={<LobbyPage />} />
        <Route path='/game/:roomId' element={<GamePage />} />
      </Routes>
    </div>
  );
};

export default App;