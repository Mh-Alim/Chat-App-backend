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
const chatModel_1 = __importDefault(require("../models/chatModel"));
const chatSocketHandler = (socket, io) => {
    socket.on('add_user', (myId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
        const hasChatBefore = yield chatModel_1.default.findOne({ users: [myId, otherUserId] });
        if (hasChatBefore) {
            socket.emit("add_user_fail", "Already added");
            return;
        }
        const chat = new chatModel_1.default({
            isGroupChat: false,
            users: [myId, otherUserId],
        });
        yield chat.save();
        let res = yield chat.populate('users');
        const chatDate = res.createdAt;
        const dateObject = new Date(chatDate);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        console.log(res);
        socket.emit("add_user_success", chat.users[1]._id, chat.users[1].name, month, year, day, hours, minutes);
    }));
    socket.on("create_group", (adminId, gpName) => __awaiter(void 0, void 0, void 0, function* () {
        const gpExist = yield chatModel_1.default.findOne({ name: gpName, isGroupChat: true });
        if (gpExist) {
            socket.emit("create_group_error", "Group already exists");
            return;
        }
        const gp = new chatModel_1.default({
            name: gpName,
            isGroupChat: true,
            users: [adminId],
            groupAdmin: adminId
        });
        yield gp.save();
        socket.emit("create_group_success");
        io.emit("group_created", gp._id, gp.name);
    }));
};
exports.default = chatSocketHandler;
