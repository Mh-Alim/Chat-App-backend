import express from "express";
import { Authorization } from "../middleware/Authorization";
import { userChats,chatRooms,createGroupController,getAllChatGroups,AllChatsController } from "../controllers/chatController";

const router = express.Router();


router.get("/chats", Authorization, userChats);
router.get("/chat-rooms", Authorization, chatRooms);
router.post("/group", createGroupController);
router.get("/groups", getAllChatGroups);
router.post("/all_chats", AllChatsController)


export default router