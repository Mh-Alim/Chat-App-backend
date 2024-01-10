import { Schema,Types , model,connect } from "mongoose";


interface IChat {
    chatName: string;
    isGroupChat: boolean;
    users: Array<Types.ObjectId>;
    lastMessage: Types.ObjectId;
    groupAdmin: Types.ObjectId;
}

const chatSchema = new Schema<IChat>({ 
    chatName: { type: String },
    isGroupChat: { type: Boolean },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    lastMessage: { 
        type: Schema.Types.ObjectId,
        ref : 'message'
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref : 'user'
    },
}, { timestamps: true })
 

const Chat = model<IChat>("chat", chatSchema);

export default Chat;