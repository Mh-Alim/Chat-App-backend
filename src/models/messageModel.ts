import { Schema, Types, model } from "mongoose";


interface IMessage {
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
    content : string,
    chat: Types.ObjectId,
}

const messageSchema = new Schema<IMessage>({
    sender: {
        type: Schema.Types.ObjectId,
        ref : "user"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref : "user"
    },
    content: {
        type : String,
        trim : true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref : "chat"
    }
}, { timestamps: true });


const Message = model<IMessage>("message", messageSchema);

export default Message;