import mongoose from "mongoose"
import nodemailer from "nodemailer"
import Otp_model from "../../models/otp-model"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()
import handlebars from "handlebars"
import fs from "fs"
import path from "path"
let types = new mongoose.Types.ObjectId()


const sendOtp = async(email: string, ownerId: typeof types,template: {title: string,desc: string,details: string})=>{

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
const relative = "../../views/index.html"
let file = fs.readFileSync(path.join(__dirname,relative),"utf-8").toString()
let compile = handlebars.compile(file)
const replacement = {
    title: template.title,
    message: `${template.desc}: ${randomOtp}`
}

let htmlFile = compile(replacement)
 if(process.env.NODE_ENV !== "test")
 transporter.sendMail({
    from: "allyearmustobey@gmail.com",
    to: "allyearmustobey@gmail.com",
    subject: template.title,
    html: htmlFile
},(error, data)=>{
    if(error){
 return  console.log("error occured while send email")
    }
    console.log("sent successfully")
   return 
})
}

export default sendOtp
