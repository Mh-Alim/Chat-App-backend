import User from "../models/userModel";


const userSocketEvents = (socket:any) => {

    socket.on("test", (message:string) => {
        console.log(message);
    })

}


export default userSocketEvents