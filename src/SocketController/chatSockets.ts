import Chat from "../models/chatModel";
import User from "../models/userModel";


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
            io.emit("new_gp",gp._id,gpName);
        }
        catch (err: any) {
            console.log(err.message);
            socket.emit('create_gp_error',err.message);
        }
    })


}

export default chatSocketHandler;