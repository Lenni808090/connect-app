import Room from "../models/room.model.js";
import { createRoomId } from "../utils/generateRoomId.js";

export const createRoom = async (req, res) => {
  try {
    const { username, userId } = req.body;

    if (!username || !userId) {
      return res.status(400).json({
        success: false,
        error: "Username and userId are required",
      });
    }
    
    const roomId = createRoomId();
    const room = new Room({
      roomId,
      players: [
        {
          username,
          userId,
          isHost: true,
        },
      ],
      categories: [
        "Tiere", "Essen", "Städte", "Berufe", "Sport", "Länder", "Pflanzen", "Musik", "Filme", "Serien",
        "Automarken", "Farben", "Kleidung", "Möbel", "Werkzeuge", "Gefühle", "Wetter", "Sprachen", "Instrumente", "Feiertage",
        "Kontinente", "Getränke", "Süßigkeiten", "Meereslebewesen", "Vögel", "Reptilien", "Insekten", "Haustiere", "Wildtiere", "Marken",
        "Technik", "Berühmte Persönlichkeiten", "Schauspieler", "Sänger", "Tänze", "Computerspiele", "Brettspiele", "Länderhauptstädte", "Sehenswürdigkeiten", "Religionen",
        "Mythen", "Märchen", "Superhelden", "Schurken", "Bücher", "Autoren", "Universitäten", "Schulgegenstände", "Verkehrsmittel", "Kontosysteme",
        "Berühmte Gemälde", "Künstler", "Musikgenres", "Filmgenres", "Naturkatastrophen", "Berge", "Flüsse", "Seen", "Meere", "Körperteile",
        "Krankheiten", "Medikamente", "Chemikalien", "Elemente", "Planeten", "Sternbilder", "Raumfahrt", "Berühmte Reden", "Politiker", "Kriege",
        "Historische Ereignisse", "Erfindungen", "Architekturstile", "Gebäudearten", "Zeitungen", "Magazine", "TV-Sender", "Radiosender", "Programmiersprachen", "Software",
        "Apps", "Soziale Netzwerke", "Spielekonsolen", "Spielzeuge", "Haushaltsgeräte", "Gartenpflanzen", "Bäume", "Blumen", "Pilze", "Fische",
        "Amphibien", "Dinosaurier", "Fantasy-Wesen", "Science-Fiction-Begriffe", "Spukorte", "Monster", "Zaubersprüche", "Waffenarten", "Rüstungen", "Materialien",
        "Stoffe", "Textilien", "Wohnräume", "Dekoration", "Architekten", "Dichter", "Philosophen", "Psychologen", "Physiker", "Chemiker",
        "Mathematiker", "Biologen", "Astronomen", "Computersysteme", "Datenformate", "Dateiendungen", "Programmbefehle", "Betriebssysteme", "Open-Source-Projekte", "YouTuber",
        "Twitch-Streamer", "TikTok-Trends", "Internet-Memes", "Mode-Trends", "Epochen", "Götter", "Religionen", "Tempel", "Festungen", "Schlösser",
        "Länderflaggen", "Autos", "Motorräder", "LKWs", "Flugzeuge", "Flughäfen", "Zugtypen", "Schiffstypen", "Segelboote", "Sportarten",
        "Olympische Disziplinen", "Mannschaftssport", "Extremsport", "Kampfsport", "Tanzstile", "Yoga-Übungen", "Fitnessgeräte", "Diäten", "Vitamine", "Mineralstoffe",
        "Fast-Food-Ketten", "Restaurants", "Kochtechniken", "Küchenarten", "Backwaren", "Suppen", "Soßen", "Obst", "Gemüse", "Getreide",
        "Nüsse", "Gewürze", "Kräuter", "Öle", "Milchprodukte", "Fleischsorten", "Fische & Meeresfrüchte", "Alkoholsorten", "Cocktails", "Teearten",
        "Kaffeesorten", "Eissorten", "Comics", "Manga", "Anime", "Cartoons", "Spieleentwickler", "Game Engines", "Tools", "Code-Editoren",
        "Lernplattformen", "Hobbys", "DIY-Projekte", "Bastelmaterialien", "Musikinstrumente", "Tonarten", "Akkorde", "Lieder", "Songtexte", "Filmzitate",
        "Redewendungen", "Sprichwörter", "Emojis", "Internet-Abkürzungen", "Sprachen der Welt", "Dialekte", "Zeichensysteme", "Typografien", "Schriftarten", "Emo-Stile"
      ],
      scoreLimit: 5,
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
    const { roomId, username, userId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    const newPlayer = {
      username,
      userId,
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

export const leaveRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.players = room.players.filter((ply) => ply.userId !== userId);

    await room.save();

    return res.status(200).json({ message: "Player removed from room" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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

export const setScoreLimit = async (req, res) => {
  try {
    const { roomId, scoreLimit } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    room.scoreLimit = scoreLimit;
    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Setzen des scoreLimits:", error);
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
    const { roomId, userId, word } = req.body;

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
      (sub) => sub.userId === userId
    );
    if (existingSubmission) {
      existingSubmission.word = word;
    } else {
      room.submissions.push({ userId, word });
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

export const voting = async (req, res) => {
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
    const { roomId, userId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    const player = room.players.find((ply) => ply.userId === userId);

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

export const nextRound = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Raum nicht gefunden",
      });
    }

    const randomCategory = room.categories[Math.floor(Math.random() * room.categories.length)];

    room.submissions = [];
    room.gameState = "playing";
    room.currentCategory = randomCategory;
    room.round += 1;

    await room.save();

    res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.log("Fehler beim Starten der nächsten Runde:", error);
    res.status(500).json({ error: "Interner Server Fehler" });
  }
};
