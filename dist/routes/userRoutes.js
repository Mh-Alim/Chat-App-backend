"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Authorization_1 = require("../middleware/Authorization");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({
        message: "User Route is working properly"
    });
});
router.post("/register", userController_1.registerController);
router.post("/login", userController_1.loginController);
router.get("/user-exists", Authorization_1.Authorization, userController_1.userExist);
router.get("/users", userController_1.allUsersController);
router.post("/receiver-details", userController_1.receiverDetails);
exports.default = router;
