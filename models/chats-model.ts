import mongoose from "mongoose"


const chatSchema = new mongoose.Schema({
    members: {
        type: [String]
    }
},{
    timestamps: true
})


const ChatModel = mongoose.model("chats", chatSchema)

export default ChatModel