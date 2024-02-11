import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    message: {type: String, required: true},
    senderId: {type: String, required: true},
    chatId: {type: mongoose.Schema.Types.ObjectId,required: true, ref: "chats"}
})

const MessageModel =  mongoose.model("messages", messageSchema)

export default MessageModel