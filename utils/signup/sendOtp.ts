import mongoose from "mongoose"
import nodemailer from "nodemailer"
import Otp_model from "../../models/otp-model"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()
import handlebars from "handlebars"
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
let file = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet">
                
  <title>Document</title>
  <style>
    *{
      font-family: Poppins;
    }
    body,html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container {
      width: 30%;
      height: auto;
      background-color: white;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.10);
      border-radius: 20px;
      position: relative;
      padding: 12px;
    }
    .name {
      font-display: capitalize;
      font-size: 14px;
      position: absolute;
      bottom: 0px;
      right: 5px;
      margin-top: px;
    }
    .image {
      width: 200px;
      height: 200px;
      background-image: url("https://i.pinimg.com/564x/95/93/66/9593663617bd45c8a30b6b1c9f97debb.jpg");
      background-size: cover;
      margin: 0 auto;
    }

    h1{
      text-align: center;
    }

    p{
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="name">Designed by: Daycare app</div>
    <div class="image"></div>
    <div class="message">
      <h1>{{title}}</h1>
      <p>{{message}}</p>
    </div>
  </div>
</body>
</html>`
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
