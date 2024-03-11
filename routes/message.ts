import express from "express"
import MessageModel from "../models/message-model"
import mongoose from "mongoose"
import schemaValidation from "../utils/message/schemaValidation"
import authMiddleware from "../middlewares/profile-middleware"

const router = express.Router()



router.get("/", authMiddleware, async (req,res)=> {
    let {chatId} = req.query
    let isValid = mongoose.isValidObjectId(chatId)
    if(!isValid){
        return res.status(404).send({message: "Invalid Chat Id"})
    }
    let messages = await MessageModel.find({chatId: chatId})
    if(!messages){
        return res.status(404).send({message: "message not found"})
    }

    res.send(messages)
})


router.post("/",authMiddleware, async (req,res)=>{
let {error} = schemaValidation(req.body)
if(error){
    return res.status(404).send({message: error.details[0].message})
}
let {message, senderId, chatId}  = req.body

let newMessage = new MessageModel({
    chatId:  new mongoose.Types.ObjectId(chatId),
    senderId,
    message
})

let  saved = await newMessage.save()
if(!saved){
    return res.status(500).send({message: "couldn't send message"})
}

res.send(saved)
})




export default router