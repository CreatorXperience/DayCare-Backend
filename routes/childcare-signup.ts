import express from "express"
import Joi from "joi"
import complexPassword from "joi-password-complexity"
import _ from "lodash"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

import child_care_signup_model from "../models/childcare-signup-model"
import validate_signup_payload from "../utils/signup/validate"
import Otp_model from "../models/otp-model"
import mongoose from "mongoose"



const router = express.Router()






let types = new mongoose.Types.ObjectId()
const sendOtp = async(email: string, ownerId: typeof types)=>{

let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {user: "allyearmustobey@gmail.com", pass: process.env.EMAIL_PASS},
})

let max =999999
let min = 100000

let randomOtp = Math.floor(Math.random()*(max-min)+1) 

let otp = new Otp_model({
otp: randomOtp,
owner: new mongoose.Types.ObjectId(ownerId),
})

await otp.save()

let sender = transporter.sendMail({
    from: "allyearmustobey@gmail.com",
    to: email,
    subject: "verification otp",
    text: `Dont share this otp with anyone keep it safe  OTP: ${randomOtp} `
},(error, data)=>{
    if(error){
       return console.log("error sending verification pin")
    }
    
   return console.log("sent successfully")
})
}




router.post("/daycare", async (req,res)=>{
let {error} = validate_signup_payload(req.body)


if(error){
   return res.status(404).send({
    message: error.details[0].message,
    status: "Failed",
   })
}

let getChildCare =  await child_care_signup_model.findOne({email: req.body.email})
if(getChildCare){
    return res.status(404).send({message: "user with this email already exist"})
}




let child_care_payload = _.pick(req.body, ["fullname", "email", "password"])


let child_care = new child_care_signup_model(child_care_payload)

let _salt = await bcrypt.genSalt(10)
let _hash = await bcrypt.hash(child_care.password, _salt)
child_care.password = _hash

let  response = await child_care.save()
if(!response){
    return res.status(404).send({message: "couldn't save file to database"})
}

await sendOtp(req.body.email, child_care._id)


return  res.send({
    message: _.pick(response, ["fullname", "email"]),
    status: " verification email send Succesfull"
})
})


export default router