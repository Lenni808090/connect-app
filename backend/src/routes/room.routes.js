import express from "express";
import { createRoom, joinRoom, setCategories, startGame, submitWord, endRound, checkifHost, getRoom, leaveRoom } from "../controllers/room.controller.js";
const router = express.Router();

router.post("/createRoom", createRoom);
router.post("/joinRoom", joinRoom);
router.post("/leaveRoom", leaveRoom);
router.post("/setCategories", setCategories);
router.post("/startGame", startGame);
router.post("/submitWord", submitWord);
router.post("/endRound", endRound);
router.get("/checkifHost/:roomId/user/:userId", checkifHost);

router.get("/getRoom/:roomId", getRoom)
export default router;
