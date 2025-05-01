import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://connect-app-api.vercel.app/api",
    withCredentials: true,
});