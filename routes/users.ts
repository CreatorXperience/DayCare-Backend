import express from "express"
import mongoose from "mongoose"
import user_signup_model from "../models/user-account-model"
import authMiddleware from "../middlewares/profile-middleware"

const router = express.Router()


router.get("/", authMiddleware ,  async (req,res)=>{
    let {id, chatId} = req.query
    if(!id ||  id === "undefined" || !mongoose.isValidObjectId(id)){
        return res.status(404).send({messsage: "Invalid or no query id"})
    }
    let user = await user_signup_model.findOne({_id: id}, {password: 0, email: 0, favorite: 0,is_verified: 0})
    if(!user){
        return res.status(404).send({message: "user not found"})
    }
    res.send({...user, chatId: chatId})
})


export default router