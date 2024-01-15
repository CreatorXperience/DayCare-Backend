import express from "express"
import Joi from "joi"
import complexPassword from "joi-password-complexity"
import user_signup_model from "../models/user-account-model"
import bcrypt from "bcryptjs"

const router = express.Router()

type TUser = {
    email: string,
    password: string
}

const validateUserPayload = (userPayload: TUser)=>{
    let passwordOption = {
        min: 10,
        max: 20,
        lowerCase:1,
        upperCase:1,
        numeric:1,
        symbol: 1
    }
    const validation = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: complexPassword(passwordOption).required().min(5).max(30)
    })

   return  validation.validate(userPayload)
}
router.post("/", async (req,res)=>{

let {error} = validateUserPayload(req.body)
if(error){
    return res.status(404).send({message: error.details[0].message, status: "failed"})
}
let child_care = await user_signup_model.findOne({email: req.body.email})
if(!child_care){
    return res.status(404).send({message: "user with the specified email doesn't exist", status: "failed"})
}

let isPasswordEqual =  await bcrypt.compare(req.body.password, child_care.password)

if(!isPasswordEqual){
    return res.status(404).send({message: "Invalid email or Password"})
}

let token = child_care.generateAuthToken()
res.setHeader("authorization", token).send({message: "user logged in successfully", status: "successfull"})

})

export default router