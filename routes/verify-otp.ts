import express from "express"
import Joi from "joi"
import bcrypt from "bcryptjs"
import user_signup_model from "../models/childcare-signup-model"
import Otp_model from "../models/otp-model"

const router =  express.Router()


let otpValidation = (otpPayload: {otp: string})=>{
    let otpSchema = Joi.object({
        otp: Joi.string().required().min(4).max(4),
        ownerId: Joi.string().required()
    })

  return otpSchema.validate(otpPayload)
}
router.post("/", async(req,res)=>{
    let {error} = otpValidation(req.body)
    if(error){
        return res.status(404).send({message: error.details[0].message})
    }
    let getOtp = await Otp_model.findOne({owner: req.body.ownerId})
    if(!getOtp){
        return res.status(404).send({message: "otp expired, request a new one"})
    }
    let isOtpEqual =  await bcrypt.compare(req.body.otp, getOtp.otp)
    if(!isOtpEqual){
    return res.status(404).send({message: "wrong otp"})
    }
	
    let updateUser =  await user_signup_model.updateOne({_id: req.body.ownerId}, {$set: {is_verfied: true}})
    if(!updateUser){
	return res.status(500).send({message: "error occured while updating user"})
    }

    res.send({message: "email verified successfully", status: "successfull"})
    
})


export default router
