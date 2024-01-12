import express from "express";
import { Authorization } from "../middleware/Authorization";
import { userChats,chatRooms } from "../controllers/chatController";

const router = express.Router();


router.get("/chats", Authorization, userChats);
router.get("/chat-rooms",Authorization, chatRooms)

export default router