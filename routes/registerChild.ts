import express, { Request } from "express"
import mongoose from "mongoose"
import _ from  "lodash"
import authMiddleware from "../middlewares/profile-middleware"
import RegisteredDaycareModel from "../models/registeredDaycares"
import sendMail from "../utils/mail/sendMail"
import user_signup_model from "../models/user-account-model"
import { link } from "joi"
import { child_care_model } from "../models/child-care-profile"
const router = express.Router()


router.post("/:daycareId",authMiddleware, async (req: Request & {user?:string},res)=>{
    let {daycareId} =  req.params
    if(!mongoose.isValidObjectId(daycareId) &&  !mongoose.isValidObjectId(req.user)){
        return res.status(404).send({message: "Invalid Object Id"})
    }

    let existingRegistration = await RegisteredDaycareModel.findOne({registered: {$all: [req.user,daycareId]}})

    if(existingRegistration){
        return  res.send(existingRegistration)
    }

    let newRegistration =  new RegisteredDaycareModel({registered: [req.user,daycareId]})
    let saved = await newRegistration.save()
    if(!saved){
        return  res.status(500).send({message: "couldn't register to the daycare"})
    }
    const user = await user_signup_model.findOne({_id: req.user})
    const daycare = await child_care_model.findOne({_id: daycareId})
    let payload = {
    title: "Registed to Daycare successfully", 
    desc: "Thanks for Registering", 
    link: "https://i.pinimg.com/564x/55/8f/ae/558faee2286118f7ab33a862f7ca03d8.jpg",
    to: user?.fullname as string,
    name: daycare?.title as string
 }
    await sendMail(user?.email as string, payload)
    res.send(saved)
}) 


router.get("/registeredDaycares", authMiddleware,  async (req: Request & {user?: string},res)=>{
    let userId = req.user
    let user = await RegisteredDaycareModel.findOne({registered: {$in: [userId]}})
    if(!user){
        return  res.status(404).send({message: "user is not registered"})
    }
    res.send(user)
})

router.get("/registered/:daycareId", authMiddleware, async (req: Request & {user?: string},res)=>{
    let  {daycareId} = req.params
    if(!daycareId){
        return res.status(404).send({message: "daycare id not provided"})
    }
    let registered = await RegisteredDaycareModel.findOne({registered: {$all: [req.user, daycareId]}})

    if(!registered){
        return res.status(404).send({message: "Not Registered"})
    }
    res.send(registered)
})

export default router
