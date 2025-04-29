import express from "express";
import { createRoom, joinRoom, setCategories, startGame, submitWord, endRound, checkifHost } from "../controllers/room.controller.js";
const router = express.Router();

router.post("/createRoom", createRoom);
router.post("/joinRoom", joinRoom);
router.post("/setCategories", setCategories);
router.post("/startGame", startGame);
router.post("/submitWord", submitWord);
router.post("/endRound", endRound);
router.post("/checkifHost", checkifHost);

export default router;
