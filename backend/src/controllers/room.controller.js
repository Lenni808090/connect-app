import Room from "../models/room.model.js";
import { createRoomId } from "../utils/generateRoomId.js";

export const createRoom = async (req, res) => {
  try {
    const { username, socketId } = req.body;

    if (!username || !socketId) {
      return res.status(400).json({
        success: false,
        error: "Username and socketId are required",
      });
    }

    const roomId = createRoomId();
    const room = new Room({
      roomId,
      players: [
        {
          username,
          socketId,
          isHost: true,
        },
      ],
    });

    await room.save();
    res.status(201).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("error in create room controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId, username, socketId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    const newPlayer = {
      username,
      socketId,
      isHost: room.players.length === 0,
    };

    room.players.push(newPlayer);
    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Beitreten des Raums:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const setCategories = async (req, res) => {
  try {
    const { roomId, categories } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    room.categories = categories;
    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Setzen der Kategorien:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const startGame = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    // Mindestanzahl von Spielern prüfen
    if (room.players.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Mindestens 2 Spieler werden benötigt, um das Spiel zu starten",
      });
    }

    // Zufällige Kategorie auswählen
    const categories = ["Tiere", "Essen", "Städte", "Berufe", "Sport"];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    room.gameState = "playing";
    room.currentCategory = randomCategory;
    room.round += 1;

    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Starten des Spiels:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const submitWord = async (req, res) => {
  try {
    const { roomId, socketId, word } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    if (room.gameState !== "playing") {
      return res.status(400).json({
        success: false,
        error: "Das Spiel befindet sich nicht in der Spielphase",
      });
    }

    const existingSubmission = room.submissions.find(
      (sub) => sub.socketId === socketId
    );
    if (existingSubmission) {
      existingSubmission.word = word;
    } else {
      room.submissions.push({ socketId, word });
    }

    if (room.submissions.length === room.players.length) {
      room.gameState = "voting";
    }

    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Einreichen eines Wortes:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const endRound = async (req, res) => {
  try {
    const { roomId, decision } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    if (decision) {
      room.currentScore++;
    } else {
      room.currentScore = 0;
    }

    // Spielstatus aktualisieren
    room.gameState = "finished";

    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });

    room.submissions = [];
  } catch (error) {
    console.log("Fehler beim Beenden der Runde:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const checkifHost = async (req, res) => {
  try {
    const { roomId, socketId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    const player = room.players.find((ply) => ply.socketId === socketId);

    if (!player) {
      return res.status(404).json({
        success: false,
        error: "Spieler nicht gefunden",
      });
    }

    const isHost = player.isHost;

    res.status(200).json({
      success: true,
      isHost,
    });
  } catch (error) {
    console.log("Fehler beim checken für Host", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    res.status(200).json(room)

  } catch (error) {
    console.log("Fehler bei getRoom", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};
