import mongoose, { ConnectOptions } from "mongoose";



const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL || '');
        console.log("mongodb connected");
    }   
    catch (err) {
        console.log("Mongodb connection error ",err);
    }
    
};
  
  export { connectToMongoDB }; 