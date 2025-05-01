import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
export const useRoomStore = create((set) => ({
  players: [],
  success: [],
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

}));
