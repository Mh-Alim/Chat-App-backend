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
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
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
    socket.on("create_gp", (_id, gpName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(_id, gpName);
            const gpExist = yield chatModel_1.default.findOne({ chatName: gpName, isGroupChat: true });
            if (gpExist) {
                throw new Error("Group name already exists");
            }
            console.log("creating gp");
            const gp = new chatModel_1.default({
                chatName: gpName,
                isGroupChat: true,
                users: [_id],
                groupAdmin: _id
            });
            yield gp.save();
            socket.emit('create_gp_success');
            io.emit("new_gp", gp._id, gpName, JSON.stringify(gp.createdAt), _id);
        }
        catch (err) {
            console.log(err.message);
            socket.emit('create_gp_error', err.message);
        }
    }));
    socket.on('add_user_to_sidebar', (myId, otherUserId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userAdded = yield chatModel_1.default.findOne({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: myId } } },
                    { users: { $elemMatch: { $eq: otherUserId } } }
                ]
            });
            console.log("userAdded is : ", userAdded);
            if (userAdded) {
                throw new Error("User already added");
            }
            const chat = new chatModel_1.default({
                isGroupChat: false,
                users: [myId, otherUserId]
            });
            yield chat.save();
            const myDetails = yield userModel_1.default.findOne({ _id: myId }).select("-password -email");
            console.log("MY Details ", myDetails);
            const otherUserDetails = yield userModel_1.default.findOne({ _id: otherUserId }).select("-password -email");
            console.log("Other User Details ", otherUserDetails);
            socket.emit('add_user_to_sidebar_success');
            const updatedAt = chat.updatedAt;
            console.log(typeof (myDetails === null || myDetails === void 0 ? void 0 : myDetails._id));
            io.emit("add_user_sidebar", myDetails, otherUserDetails, updatedAt);
        }
        catch (err) {
            console.log("err: ", err.message);
            socket.emit('add_user_to_sidebar_fail', err.message);
        }
    }));
    socket.on("add_gp_to_sidebar", (myId, gpId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let group = yield chatModel_1.default.findOne({
                _id: gpId,
                users: { $elemMatch: { $eq: myId } }
            });
            console.log("group is : ", group);
            if (group) {
                throw new Error("You have already joined");
                return;
            }
            group = yield chatModel_1.default.findOne({ _id: gpId });
            console.log("group: ", group);
            let arr = group.users;
            let group_users = [...arr, new mongoose_1.default.Types.ObjectId(myId)];
            group.users = group_users;
            yield group.save();
            socket.emit('add_gp_to_sidebar_success');
        }
        catch (err) {
            console.log("err: ", err.message);
            socket.emit('add_gp_to_sidebar_fail', err.message);
        }
    }));
};
exports.default = chatSocketHandler;
