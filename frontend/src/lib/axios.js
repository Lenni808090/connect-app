import axios from "axios";

// Determine if we're in production by checking the current URL
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Print the result for testing
console.log("Environment detection test:");
console.log("Current hostname:", window.location.hostname);
console.log("Is production environment?", isProduction);
console.log("Using API URL:", isProduction 
    ? "https://connect-app-api.vercel.app/api" 
    : "http://localhost:5001/api");

export const axiosInstance = axios.create({
    baseURL: isProduction
        ? "https://connect-app-api.vercel.app/api" 
        : "http://localhost:5001/api",
    withCredentials: true,
});