import express, { Request } from "express"
import mongoose from "mongoose"
import _ from  "lodash"
import authMiddleware from "../middlewares/profile-middleware"
import RegisteredDaycareModel from "../models/registeredDaycares"
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
