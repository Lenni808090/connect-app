import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
export const useRoomStore = create((set) => ({
  players: [],
  success: [],
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
      const res = await axiosInstance.post("/rooms/createRoom",data);
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
  }
}));
