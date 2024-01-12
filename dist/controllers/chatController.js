"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRooms = exports.userChats = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chatModel_1.default.find({ users: req.user._id });
    return res.status(200).json({
        success: true,
        chats
    });
});
exports.userChats = userChats;
const chatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myId = req.user._id;
    let chatRooms = yield chatModel_1.default.find({ users: { $elemMatch: { $eq: myId } } }).populate({
        path: 'users',
        model: 'user',
        select: '-password -email'
    }).populate({
        path: 'lastMessage',
        model: 'message',
        select: '-sender -receiver'
    });
    const date = chatRooms.lastMessage ? chatRooms.lastMessage.createdAt : chatRooms.createdAt;
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const min = dateObject.getMinutes();
    const filterdChatRooms = chatRooms.map((room) => {
        const date = room.lastMessage ? room.lastMessage.createdAt : room.createdAt;
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const min = dateObject.getMinutes();
        return {
            _id: room._id,
            name: room.name ? room.name : room.users[1].name,
            lastMessage: room.lastMessage,
            month,
            day,
            year,
            hours,
            min
        };
    });
    res.status(200).json({
        success: true,
        chatRooms: filterdChatRooms
    });
});
exports.chatRooms = chatRooms;
