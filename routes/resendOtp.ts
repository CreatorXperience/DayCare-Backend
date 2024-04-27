import express from "express"
import sendOtp from "../utils/signup/sendOtp"
import mongoose from "mongoose"
import Otp_model from "../models/otp-model"

const router =  express.Router()

router.get("/:email/:id", async(req,res)=>{
let {email, id} = req.params
if(!email || email === "undefined" || !mongoose.isValidObjectId(id)){
    return res.status(404).send({message: "Invalid email provided"})
}

let userId = new mongoose.Types.ObjectId(id)

let removeOtp = await Otp_model.deleteMany({owner: id})

if(!removeOtp){
    res.status(500).send({message: "could not remove previous otp"})
}

let message= {
    title: "Your Verification Code",
    desc: "To verify your account, enter this code on daily.dev:",
    details: ""
}
await sendOtp(email,userId,message)
})

export default router