"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user"
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "chat"
    }
}, { timestamps: true });
const Message = (0, mongoose_1.model)("message", messageSchema);
exports.default = Message;
