import Room from "../models/room.model.js";
import { createRoomId } from "../utils/generateRoomId.js";

export const createRoom = async (req, res) => {
    try{
        const { username, socketId } = req.body;
        
        if (!username || !socketId) {
            return res.status(400).json({
                success: false,
                error: 'Username and socketId are required'
            });
        }

        const roomId = createRoomId();
        const room = new Room({
            roomId,
            players: [{
                username,
                socketId,
                isHost: true
            }],
        }); 

        await room.save();
        res.status(201).json({ 
            success: true,
            room: room 
        });
    }catch(error){
        console.log("error in create room controller:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const joinRoom = async (req, res) => {
    try {
        const { roomId, username, socketId } = req.body;

        const room = await Room.findOne({ roomId });
        
        if (!room) {
            return res.status(404).json({ 
                success: false,
                error: 'Raum nicht gefunden' 
            });
        }

        const newPlayer = {
            username,
            socketId,
            isHost: room.players.length === 0
        };

        room.players.push(newPlayer);
        await room.save();

        res.status(200).json({ 
            success: true,
            room: room 
        });
    } catch (error) {
        console.log("Fehler beim Beitreten des Raums:", error);
        res.status(500).json({ error: 'Interner Server Fehler' });
    }
}
