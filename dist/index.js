"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const SocketController_1 = __importDefault(require("./SocketController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// connection to mongodb
(0, database_1.connectToMongoDB)();
app.get("/", (req, res) => {
    res.json({
        data: "express + Typesript"
    });
});
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use("/user", userRoutes_1.default);
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
app.use("/chat", chatRoutes_1.default);
const server = app.listen(5000, () => {
    console.log(`server is running on port ${port}`);
});
// socket connection
(0, SocketController_1.default)(server);
