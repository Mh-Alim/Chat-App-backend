"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorization_1 = require("../middleware/Authorization");
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.get("/chats", Authorization_1.Authorization, chatController_1.userChats);
router.get("/chat-rooms", Authorization_1.Authorization, chatController_1.chatRooms);
router.post("/group", chatController_1.createGroupController);
router.get("/groups", chatController_1.getAllChatGroups);
router.post("/all_chats", chatController_1.AllChatsController);
exports.default = router;
