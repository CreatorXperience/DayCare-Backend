import express from "express"
import _ from "lodash"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import user_signup_model from "../models/user-account-model"
import validate_signup_payload from "../utils/signup/validate"
import sendOtp from "../utils/signup/sendOtp"

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


let child_care = new user_signup_model(child_care_payload)

let _salt = await bcrypt.genSalt(10)
let _hash = await bcrypt.hash(child_care.password, _salt)
child_care.password = _hash

let  response = await child_care.save()
if(!response){
    return res.status(500).send({message: "couldn't save file to database"})
}


await sendOtp(req.body.email, child_care._id)


return  res.send({
    message: _.pick(response, ["fullname", "email", "_id"]),
    status: " verification email sent succesfully"
})
})


export default router