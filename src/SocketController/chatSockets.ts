import mongoose, { mongo } from "mongoose";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import Message from "../models/messageModel";


const chatSocketHandler = (socket: any,io:any) => {
    socket.on('add_user', async (myId: string, otherUserId: string) => {
        const hasChatBefore = await Chat.findOne({ users: [myId, otherUserId] });

        if (hasChatBefore) {
            socket.emit("add_user_fail", "Already added")
            return;
        }
        const chat: any = new Chat({
            isGroupChat: false,
            users: [myId, otherUserId],
        });
        
        await chat.save()
        let res = await chat.populate('users')
        
        const chatDate = res.createdAt;
        const dateObject: Date = new Date(chatDate);
        const year: number = dateObject.getFullYear();
        const month: number = dateObject.getMonth() + 1;
        const day: number = dateObject.getDate();
        const hours: number = dateObject.getHours();
        const minutes: number = dateObject.getMinutes();
        console.log(res);
        socket.emit("add_user_success", chat.users[1]._id, chat.users[1].name, month, year, day, hours, minutes)
        
    });


    socket.on("create_gp", async (_id:string,gpName : string) => {
        try {
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
            
            socket.emit('create_gp_success');
            io.emit("new_gp",gp._id,gpName,JSON.stringify(gp.createdAt),_id);
        }
        catch (err: any) {
            console.log(err.message);
            socket.emit('create_gp_error',err.message);
        }
    })


    socket.on('add_user_to_sidebar', async (myId: string, otherUserId: string) => {
        try {

            
            const userAdded = await Chat.findOne({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: myId } } },
                    { users: { $elemMatch: { $eq: otherUserId } } }
                ]
            })
            console.log("userAdded is : ", userAdded);
            if (userAdded) {
                throw new Error("User already added");
            }

            const chat = new Chat({
                isGroupChat: false,
                users: [myId, otherUserId]
            });
            await chat.save();

            const myDetails = await User.findOne({ _id: myId }).select("-password -email");
            console.log("MY Details ", myDetails);

            const otherUserDetails = await User.findOne({ _id: otherUserId }).select("-password -email");
            console.log("Other User Details ", otherUserDetails);
            socket.emit('add_user_to_sidebar_success');

            const updatedAt = chat.updatedAt;
            console.log(typeof myDetails?._id);

            io.emit("add_user_sidebar", JSON.stringify(chat._id),myDetails, otherUserDetails, updatedAt)
        }
        catch (err: any) {
            console.log("err: ", err.message);
            socket.emit('add_user_to_sidebar_fail', err.message)
        }
    });


    socket.on("add_gp_to_sidebar", async (myId: string, gpId: string) => {

        try {
            let group:any = await Chat.findOne({
                _id: gpId,
                users : { $elemMatch : { $eq : myId}}
            });
            console.log("group is : ", group);
            

            if (group) {
                throw new Error("You have already joined");
                return;
            }
            
            group = await Chat.findOne({ _id: gpId });

            console.log("group: ", group);
            let arr = group.users;
            let group_users:any= [...arr,new mongoose.Types.ObjectId(myId)];

            group.users = group_users;
            await group.save();




            socket.emit('add_gp_to_sidebar_success');
        }
        catch (err: any) {
            console.log("err: ", err.message);
            socket.emit('add_gp_to_sidebar_fail', err.message)
        }
    });


    socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log("connected to room ",roomId);
    });

    socket.on('leaveRoom', (roomId: string) => { 
        socket.leave(roomId);
        console.log("left the room ", roomId);
    })

    socket.on('sendMessage', async (content: string, senderId : string, roomId : string) => {
        
        const chatRoom = await Chat.findOne({ _id: roomId });
        if (!chatRoom) throw new Error(`Room does not exist!!!`);
        
        if (chatRoom?.isGroupChat) {
            const message = new Message({
                sender: senderId,
                content,
                chat: roomId
            });
            await message.save();
            const populatedMessage = await Message.findOne({ _id: message._id }).populate({path:'sender', select: '-password -email'});
            io.to(roomId).emit('message_received', populatedMessage);
            return
        }
        // one to one chat
        const receiverId = chatRoom.users[0].toString() === senderId? chatRoom.users[1] : chatRoom.users[0];
        const receiverDetails = await User.findOne({ _id: receiverId });
        console.log("rec ",receiverDetails)
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
            chat: roomId
        })
        await message.save();
        const populatedMessage = await Message.findOne({ _id: message._id }).populate({path:'sender', select: '-password -email'}).populate({path:'receiver', select : '-password -email'});
        io.to(roomId).emit('message_received', populatedMessage);
    })
}

export default chatSocketHandler;