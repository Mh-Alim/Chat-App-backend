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
exports.receiverDetails = exports.allUsersController = exports.userExist = exports.registerController = exports.loginController = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const SocketController_1 = require("../SocketController");
const chatModel_1 = __importDefault(require("../models/chatModel"));
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user)
            throw new Error("Email is not correct");
        if (!user.comparePassword(password))
            throw new Error("Invalid password");
        const token = user.getJwtToken();
        res.setHeader('X-Authorization', `Bearer ${token}`);
        res.setHeader("Access-Control-Expose-Headers", "X-Authorization");
        // 200 - OK
        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.log(err.message);
        // 401 - unauthorized
        return res.status(401).json({
            success: false,
            message: "invalid email or password"
        });
    }
});
exports.loginController = loginController;
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // check whether email exists or not
    const userExist = yield userModel_1.default.findOne({ email });
    console.log(userExist);
    if (userExist)
        return res.status(409).json({
            success: false,
            message: "You already have an account"
        });
    // email doesnt exist in db
    const user = new userModel_1.default({
        name,
        email,
        password
    });
    yield user.save();
    // jwt token generated
    const token = user.getJwtToken();
    res.setHeader('X-Authorization', `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "X-Authorization");
    console.log("calling event");
    SocketController_1.outerIo.emit("new_user", user._id, user.name);
    res.status(201).json({
        success: true,
        message: "Successfully Registered",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});
exports.registerController = registerController;
const userExist = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User Exists",
        user: req.user
    });
};
exports.userExist = userExist;
const allUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find().select("-password -email");
    res.status(200).json({
        success: true,
        users
    });
});
exports.allUsersController = allUsersController;
const receiverDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, sender } = req.body;
        if (!chatId)
            throw new Error(`chat id not found`);
        const chat = yield chatModel_1.default.findOne({ _id: chatId });
        if (chat.isGroupChat) {
            return res.status(200).json({
                success: true,
                isGroupChat: true,
                room: chat,
            });
        }
        const receiverId = (chat === null || chat === void 0 ? void 0 : chat.users[0].toString()) === sender._id ? chat === null || chat === void 0 ? void 0 : chat.users[1] : chat === null || chat === void 0 ? void 0 : chat.users[0];
        const receiverDetails = yield userModel_1.default.findOne({ _id: receiverId });
        res.status(200).json({
            success: true,
            isGroupChat: false,
            receiver: receiverDetails,
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.receiverDetails = receiverDetails;
