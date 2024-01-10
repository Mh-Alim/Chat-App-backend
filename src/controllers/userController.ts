import { Request,Response } from "express"
import User from "../models/userModel";

export const loginController = async (req: Request, res: Response) => {
    
    try {
        type ReqBody = {
            email: string,
            password: string
        }
        const { email, password }: ReqBody = req.body;

        const user = await User.findOne({ email });

        if(!user) throw new Error("Email is not correct")
        if(!user.comparePassword(password)) throw new Error("Invalid password")
        const token = user.getJwtToken();

        res.setHeader('X-Authorization', `Bearer ${token}`);
        res.setHeader("Access-Control-Expose-Headers", "X-Authorization");

        // 200 - OK
        return res.status(200).json({
            success: true,
            message: "Login Successfull",
            user: {
                name: user.name,
                email : user.email
            }
        })

    }
    catch (err: any) {
        console.log(err.message);

        // 401 - unauthorized
        return res.status(401).json({
            success: false,
            message : "invalid email or password"
        })
    }
    

}




export const registerController = async(req:Request,res: Response) => { 
    console.log("register controller");
    const { name, email, password }: { name: string, email: string, password: string } = req.body;
    
    // check whether email exists or not

    const userExist = await User.findOne({ email });
    console.log(userExist);
    if (userExist)
        return res.status(409).json({
            success : false,
            message : "You already have an account"
        })

    // email doesnt exist in db
    
    const user = new User ({
        name,
        email,
        password
    })
    await user.save();
    console.log(typeof user._id);
    // jwt token generated
    const token: string = user.getJwtToken();
    res.setHeader('X-Authorization', `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "X-Authorization");
    res.status(201).json({
        success: true,
        message: "Successfully Registered",
        user: {
            name: user.name,
            email : user.email
        }
    })

}


export const userExist = (req: Request, res : Response) => {

    return res.status(200).json({
        success: true,
        message : "User Exists"
        
    })
}