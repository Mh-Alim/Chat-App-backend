"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outerIo = void 0;
const socket_io_1 = require("socket.io");
const userSocket_1 = __importDefault(require("./userSocket"));
const chatSockets_1 = __importDefault(require("./chatSockets"));
let outerIo;
const socketHandler = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    io.on("connection", (socket) => {
        console.log("socket connected");
        (0, userSocket_1.default)(socket);
        (0, chatSockets_1.default)(socket, io);
        socket.on('disconnect', () => {
            console.log("socket disconnected");
        });
    });
    exports.outerIo = outerIo = io;
};
exports.default = socketHandler;
