import express from "express";
import { loginController, registerController, userExist, allUsersController } from "../controllers/userController";
import { Authorization } from "../middleware/Authorization";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message : "User Route is working properly"
    })
})
router.post("/register", registerController)
router.post("/login", loginController);
router.get("/user-exists", Authorization, userExist);
router.get("/users" ,allUsersController)

export default router