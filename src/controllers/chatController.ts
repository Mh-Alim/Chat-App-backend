import { Request,Response } from "express"
import Chat from "../models/chatModel"
import {outerIo} from "../SocketController/index"



export const userChats = async (req: any, res : Response) => {
    const chats = await Chat.find({users : req.user._id});
    return res.status(200).json({
        success: true,
        chats
    })
}

export const chatRooms = async (req: any , res : Response) => {
    try {
        const myId = req.user._id;

        let chatRooms:any = await Chat.find({ users: { $elemMatch: { $eq: myId } } }).populate({
            path: 'users',
            model: 'user',
            select : '-password -email'
        }).populate({
            path: 'lastMessage',
            model: 'message',
            select : '-sender -receiver'
        })


        const date = chatRooms.lastMessage ? chatRooms.lastMessage.createdAt : chatRooms.createdAt;
        const dateObject:Date = new Date(date);
        const year:number = dateObject.getFullYear();
        const month:number = dateObject.getMonth() + 1; 
        const day:number = dateObject.getDate();
        const hours:number = dateObject.getHours();
        const min: number = dateObject.getMinutes();
        
        const filterdChatRooms = chatRooms.map((room: any) => {
            const date = room.lastMessage ? room.lastMessage.createdAt : room.createdAt;
            const dateObject:Date = new Date(date);
            const year:number = dateObject.getFullYear();
            const month:number = dateObject.getMonth() + 1; 
            const day:number = dateObject.getDate();
            const hours:number = dateObject.getHours();
            const min: number = dateObject.getMinutes();
            return {
                _id: room._id,
                name: room.name ? room.name : room.users[1].name,
                lastMessage: room.lastMessage,
                month,
                day,
                year,
                hours,
                min
            }
        })
        
        res.status(200).json({
            success: true,
            chatRooms: filterdChatRooms
        })
    }
    catch (err:any) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
    

}




export const createGroupController = async (req: Request, res: Response) => {
    
    try {
        const { _id, gpName } = req.body;
        console.log(_id, gpName);
        const gpExist = await Chat.findOne({ chatName: gpName, isGroupChat: true });
        if (gpExist) {
            throw new Error("Group name already exists");
        }

        console.log("creating gp");
        const gp: any = new Chat({
            chatName: gpName,
            isGroupChat: true,
            users: [_id],
            groupAdmin: _id
        });

        await gp.save();
        
        outerIo.emit("new_gp");
        return res.status(201).json({
            success: true,
            group: gp
        })
    }
    catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
    
};


export const getAllChatGroups = async (req:Request,res: Response) => {
    try {
        const groups = await Chat.find({ isGroupChat: true });

        return res.status(200).json({
            success: true,
            groups
        });

    }
    catch (err:any) {
        console.log("getAllChatGroups error: " , err);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}