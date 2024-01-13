

const userSocketEvents = (socket:any) => {

    socket.on("test", (message:string) => {
        console.log(message);
    })

}


export default userSocketEvents