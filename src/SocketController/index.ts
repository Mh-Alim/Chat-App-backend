import { Server, Socket } from "socket.io";
import userSocketEvents from "./userSocket";
import chatSocketHandler from "./chatSockets";

export let outerSocket:any;
const socketHandler = (server : any) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    

   
    io.on("connection", (socket: any) => {
        console.log("socket connected");
        outerSocket = socket;
        userSocketEvents(socket);

        chatSocketHandler(socket,io);
        socket.on('disconnect', () => {
            console.log("socket disconnected");
        })
    })
    

}


export default socketHandler

