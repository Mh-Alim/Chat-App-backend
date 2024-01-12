import express, { Express, Request, Response } from "express";
import { connectToMongoDB } from "./database";
import cors from "cors";
import dotenv from "dotenv";

import socketHandler from "./SocketController";

dotenv.config();

const app:Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json())

// connection to mongodb
connectToMongoDB();
app.get("/", (req : Request, res: Response) => {
    res.json({
        data: "express + Typesript"
    })
})


import userRoutes from "./routes/userRoutes"
app.use("/user", userRoutes);

import chatRoutes from "./routes/chatRoutes"
app.use("/chat", chatRoutes);


const server = app.listen(5000, () => {
    console.log(`server is running on port ${port}`);
})

// socket connection


socketHandler(server);

