import mongoose from "mongoose"


const chatSchema = new mongoose.Schema({
    members: {
        type: [String],
        required: true
    }
},{
    timestamps: true
})


const ChatModel = mongoose.model("chats", chatSchema)

export default ChatModel