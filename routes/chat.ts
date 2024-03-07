import express, { Request } from "express"
import ChatModel from "../models/chats-model"
import authMiddleware from "../middlewares/profile-middleware"

const router =  express.Router()


router.post("/:secondId", authMiddleware,  async (req: Request & {user?: string},res)=> {
    let userId = req.user
    let {secondId} = req.params

let chat = await ChatModel.findOne({members: {$all: [userId, secondId]}})

if(chat){
    return  res.send({message: "chat already exist", chat})
}

let newChat  = new ChatModel({members: [userId, secondId]})
let saved = await newChat.save()

if(!saved){
return res.status(500).send({message: "Couldn't save chat"})
}
return  res.send({message: "created new chat", saved})
})


router.get("/allchats", authMiddleware,  async (req: Request & {user?: string},res)=> {
let userId = req.user

let chat = await ChatModel.find({members: {$in:  [userId]}})
if(!chat){
   return  res.status(404).send({message: "user doesn't belong to any chat"})
}
res.send({chat})
})



router.get("/single-chat/:secondId", authMiddleware, async (req: Request & {user?: string},res)=> {
    let userId =  req.user
    let {secondId} = req.params
    
    let chat = await ChatModel.findOne({members: {$all: [userId, secondId]}})
    if(!chat){
        return res.status(404).send({message: "chat not found"})
    }
    res.send({chat})
})

export default router