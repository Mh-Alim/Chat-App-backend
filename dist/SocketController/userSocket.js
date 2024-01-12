"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSocketEvents = (socket) => {
    socket.on("test", (message) => {
        console.log(message);
    });
};
exports.default = userSocketEvents;
