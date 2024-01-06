import mongoose from "mongoose"
import nodemailer from "nodemailer"
import Otp_model from "../../models/otp-model"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()

let types = new mongoose.Types.ObjectId()


const sendOtp = async(email: string, ownerId: typeof types)=>{

let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASS},
})

let max =999999
let min = 100000

let randomOtp = Math.floor(Math.random()*(max-min)+1) 

let newOtp = new Otp_model({
otp: randomOtp,
owner: new mongoose.Types.ObjectId(ownerId),
})

let salt = 10
let hash = await bcrypt.hash(randomOtp.toString(), salt)
newOtp.otp = hash

await newOtp.save()
 if(process.env.NODE_ENV !== "test")
 transporter.sendMail({
    from: "allyearmustobey@gmail.com",
    to: email,
    subject: "verification otp",
    text: `Dont share this otp with anyone keep it safe  OTP: ${randomOtp} `
},(error, data)=>{
    if(error){
 return  console.log("error occured while send email")
    }
    console.log("sent successfully")
   return 
})
}

export default sendOtp
