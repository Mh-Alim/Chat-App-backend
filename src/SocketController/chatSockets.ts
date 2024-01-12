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

    socket.on("create_group", async (adminId: string, gpName: string) => {
        
        const gpExist = await Chat.findOne({ name: gpName, isGroupChat: true });
        if (gpExist) {
            socket.emit("create_group_error","Group already exists")
            return;
        }

        const gp:any = new Chat({
            name: gpName,
            isGroupChat: true,
            users: [adminId],
            groupAdmin: adminId
        });

        await gp.save();
        socket.emit("create_group_success");
        io.emit("group_created",gp._id,gp.name)
    })
}

export default chatSocketHandler;