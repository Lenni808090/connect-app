import socket from './utils/socket'
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
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
      </Routes>
      
    </div>
  );
};

export default App;