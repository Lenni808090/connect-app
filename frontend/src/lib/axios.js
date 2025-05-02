import axios from "axios";

const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';


console.log("Environment detection test:");
console.log("Current hostname:", window.location.hostname);
console.log("Is production environment?", isProduction);
console.log("Using API URL:", isProduction
    ? "https://connect-app-700f.onrender.com/api" // <-- Add /api here
    : "http://localhost:5001/api");

export const axiosInstance = axios.create({
    baseURL: isProduction
        ? "https://connect-app-d495.onrender.com/api"  // Updated URL
        : "http://localhost:5001/api",
    withCredentials: true,
});