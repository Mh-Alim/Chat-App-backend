import jwt, { JwtPayload } from  "jsonwebtoken"
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";


interface AuthenticatedRequest extends Request {
    user? :any
}
  
export const Authorization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token: string  = req.header('Authorization')?.split(" ")[1] || "";
    
        const userId = jwt.verify(token, process.env.JWT_SECRET || "");
        let user;
        
        if (typeof userId === "object")
            user = await User.findOne({ _id: userId.id });
        else throw new Error();


        req.user = user;
        next();
    }
    catch (err:any) {
        console.log(err.message);
        return res.status(401).json({
            success: false,
            message: "You are not authorized"
        })
    }
}