import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
export const useRoomStore = create((set) => ({
  players: [],
  success: [],
  isHost: null,
  room: null,
  roomId: null,

  getPlayerNames: async (data) => {
    try {
      const res = await axiosInstance.get(`/rooms/GetRoom/${data}`);
      set({ players: res.data.players });
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  },

  createRoom: async (data) => {
    try {
      const res = await axiosInstance.post("/rooms/createRoom", data);
      set({ success: res.data.success });
      set({ roomId: res.data.room.roomId });
    } catch (error) {
      console.error("Fehler beim Erstellen des Raums:", error);
    }
  },

  joinRoom: async (data) => {
    try {
      const res = await axiosInstance.post("/rooms/joinRoom", data);
      set({ success: res.data.success });
      set({ roomId: res.data.room.roomId });
    } catch (error) {
      console.error("Fehler beim joinen des Raums:", error);
    }
  },

  leaveRoom: async (data) => {
    try {
      await axiosInstance.post("/rooms/leaveRoom", data);
      set({ roomId: null });
      set({ room: null });
    } catch (error) {
      console.error("Fehler beim leaven des Raums:", error);
    }
  },

  startGame: async (data) => {
    try {
      const res = await axiosInstance.post("/rooms/startGame", data);
      set({ success: res.data.success });
      set({ roomId: res.data.room.roomId });
    } catch (error) {
      console.error("Fehler beim starten des Spieles:", error);
    }
  },

  getRoom: async (data) => {
    try {
      const res = await axiosInstance.get(`/rooms/GetRoom/${data}`);
      set({ room: res.data });
    } catch (error) {
      console.error("Failed to fetch room:", error);
    }
  },

  submitWord: async (data) => {
    try {
      const res = await axiosInstance.post(`/rooms/submitWord`, data);
      set({room: res.data.room})
    } catch (error) {
      console.error("Failed to submit word:", error);
    }
  },

  checkIfHost: async (roomId, userId) => {
    try {
      const res = await axiosInstance.get(`/rooms/checkifHost/${roomId}/user/${userId}`);
      set({isHost: res.data.isHost})
    } catch (error) {
      console.error("Failed to check if Host:", error);
    }
  },

  voting: async (data) =>{
    try {
      const res = await axiosInstance.post(`/rooms/voting`, data);
      console.log("lol")
      set({room: res.data.room})
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  },

  nextRound: async (data) => {
    try {
      const res = await axiosInstance.post(`/rooms/nextRound`, data);
      set({room: res.data.room})
    } catch (error) {
      console.error("Failed to start next Round", error);
    }
  },

  setCategories: async (data) => {
    try {
      const res = await axiosInstance.post(`/rooms/setCategories`, data);
      set({room: res.data.room})
    } catch (error) {
      console.error("Failed to start next Round", error);
    }
  },

}));
