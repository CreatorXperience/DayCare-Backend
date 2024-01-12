import express, { Request } from "express"
import childcare_profile_model from "../models/child-care-profile"
import authMiddleware from "../middlewares/profile-middleware"
import validation from "../utils/childcares/validation"

const router = express.Router()

router.post("/", authMiddleware,  async (req:Request & {user?: string},res)=>{
let requestPayload = {...req.body, userId: req.user }

let {error} = validation(requestPayload)

if(error){
return res.status(404).send({message: error.details[0].message})
}
	 let newProfile = new childcare_profile_model(req.body)
	 let saved =  await newProfile.save()
	 if(!saved){
return res.status(404).send({message: "couldn't save profile to database", status: "successfull"})
	 }
	   return res.send(saved)
})



export default router;
