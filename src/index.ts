import express, { Express, Request, Response } from "express";
import { connectToMongoDB } from "./database";
import cors from "cors";
import dotenv from "dotenv";
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
app.use("/user",userRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})