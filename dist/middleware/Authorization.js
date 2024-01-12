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
exports.Authorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const Authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || "";
        const userId = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        let user;
        if (typeof userId === "object") {
            user = yield userModel_1.default.findOne({ _id: userId.id });
            if (!user)
                throw new Error(`User does not exist`);
        }
        else
            throw new Error();
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err.message);
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        });
    }
});
exports.Authorization = Authorization;
