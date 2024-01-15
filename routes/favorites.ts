import express, { Request } from "express"
import {child_care_model} from "../models/child-care-profile"
import authMiddleware from "../middlewares/profile-middleware"
import user_signup_model from "../models/user-account-model"
import mongoose from "mongoose"

const router  =  express.Router()



router.post("/:id", authMiddleware, async(req: Request & {user?: string},res)=>{
    let user = req.user
    let {id} = req.params

let get_childcare = await child_care_model.findById(id)
if(!get_childcare){
    return  res.status(404).send({message: "no childcares with these id"})
}

let updateUser = await user_signup_model.updateOne({_id: new mongoose.Types.ObjectId(user)},{$push: {favorite: get_childcare}})
if(!updateUser){
   return  res.status(500).send({message: "Internal Serval error"})
}
res.send({message: "added to user's favorite"})
})


export default router