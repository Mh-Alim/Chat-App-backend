"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    chatName: { type: String },
    isGroupChat: { type: Boolean },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user'
        }],
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'message'
    },
    groupAdmin: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
}, { timestamps: true });
const Chat = (0, mongoose_1.model)("chat", chatSchema);
exports.default = Chat;
