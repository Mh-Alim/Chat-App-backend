import { Request,Response } from "express"
import User from "../models/userModel";
import { outerIo } from "../SocketController";
import Chat from "../models/chatModel";

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
                id : user._id,
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
    // jwt token generated
    const token: string = user.getJwtToken();
    res.setHeader('X-Authorization', `Bearer ${token}`);
    res.setHeader("Access-Control-Expose-Headers", "X-Authorization");

    console.log("calling event");
    outerIo.emit("new_user", user._id, user.name);
    res.status(201).json({
        success: true,
        message: "Successfully Registered",
        user: {
            id : user._id,
            name: user.name,
            email : user.email
        }
    })

}


export const userExist = (req: any, res : Response) => {

    return res.status(200).json({
        success: true,
        message : "User Exists",
        user : req.user
    })
}


export const allUsersController = async (req: Request, res: Response) => {
    
    const users = await User.find().select("-password -email")
    res.status(200).json({
        success: true,
        users
    })
};




export const receiverDetails = async(req: Request, res: Response) => {
    try {
        const { chatId, sender } = req.body;
        if (!chatId) throw new Error(`chat id not found`);
        const chat: any = await Chat.findOne({ _id: chatId });

        if (chat.isGroupChat) {
            return res.status(200).json({
                success: true,
                isGroupChat: true,
                room : chat,
            })
        }
        const receiverId = chat?.users[0].toString() === sender._id ? chat?.users[1] : chat?.users[0];
        const receiverDetails = await User.findOne({ _id: receiverId });

       
        res.status(200).json({
            success: true,
            isGroupChat : false,
            receiver: receiverDetails,
        })

    }

    catch (err:any) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message : err.message
        })
    }
    


}