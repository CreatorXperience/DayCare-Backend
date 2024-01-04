import express from "express"
import Joi from "joi"
import complexPassword from "joi-password-complexity"
import child_care_signup_model from "../models/childcare-signup-model"
import _ from "lodash"
import bcrypt from "bcryptjs"


const router = express.Router()

type TSignupPaylaod = {
    fullname: string,
    email: string,
    password: string
}


const validate_signup_payload = (payload: TSignupPaylaod)=>{


let passwordOption = {
    min: 10,
    max: 20,
    lowerCase:1,
    upperCase:1,
    numeric:1,
    symbol: 1
}

let validation = Joi.object({
    fullname: Joi.string().required().max(25).min(5),
    email: Joi.string().required().min(5).max(255).email(),
    password: complexPassword(passwordOption)
})

return  validation.validate(payload)
}

router.post("/daycare", async (req,res)=>{
let {error} = validate_signup_payload(req.body)


if(error){
   return res.status(404).send({
    message: error.details[0].message,
    status: "Failed",
   })
}

let child_care_payload = _.pick(req.body, ["fullname", "email", "password"])


let child_care = new child_care_signup_model(child_care_payload)

let _salt = await bcrypt.genSalt(10)
let _hash = await bcrypt.hash(child_care.password, _salt)
child_care.password = _hash

let  response = await child_care.save()
if(response){
  return  res.send({
        message: _.pick(response, ["fullname", "email"]),
        status: "Succesfull"
    })
}
return res.status(404).send({message: "couldn't save file to database"})
})


export default router