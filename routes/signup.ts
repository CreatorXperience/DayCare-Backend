import express from "express"
import _ from "lodash"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import user_signup_model from "../models/user-account-model"
import validate_signup_payload from "../utils/signup/validate"
import sendOtp from "../utils/signup/sendOtp"
import mongoose from "mongoose"
import Otp_model from "../models/otp-model"

dotenv.config()

const router = express.Router()


router.post("/", async (req,res)=>{
let {error} = validate_signup_payload(req.body)


if(error){
   return res.status(404).send({
    message: error.details[0].message,
    status: "Failed",
   })
}

let getChildCare =  await user_signup_model.findOne({email: req.body.email})
if(getChildCare){
    return res.status(404).send({message: "user with this email already exist"})
}

let child_care_payload = _.pick(req.body, ["fullname", "email", "password"])


let user = new user_signup_model(child_care_payload)

let _salt = await bcrypt.genSalt(10)
let _hash = await bcrypt.hash(user.password, _salt)
user.password = _hash

let  response = await user.save()
if(!response){
    return res.status(500).send({message: "couldn't save file to database"})
}

let removeOtp = await Otp_model.deleteMany({owner: user.id})

if(!removeOtp){
    res.status(500).send({message: "Internal Server Error"})
}

await sendOtp(req.body.email, user._id)

return  res.send({
    message: _.pick(response, ["fullname", "email", "_id", "is_verified"]),
    status: " verification email sent succesfully"
})
})



export default router