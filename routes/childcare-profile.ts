import express from "express"
import childcare_profile_model from "../models/child-care-profile"
import profileMiddleware from "../middlewares/profile-middleware"
import validation from "../utils/profile/validation"

const router = express.Router()

router.post("/", profileMiddleware,  async (req,res)=>{
let {error} = validation(req.body)
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
