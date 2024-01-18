import express from "express"
import authMiddleware from "../middlewares/profile-middleware";
import user_profile_model from "../models/userprofile";
import schemaValidation from "../utils/childcares/userProfile/userProfileValidation";

const router = express.Router()

router.post("/",authMiddleware, async (req,res)=> {
let {error}=  schemaValidation(req.body)
if(error){
    return  res.status(404).send({message: "Bad Payload"})
}

const userProfile = new user_profile_model(req.body)
let saved = await userProfile.save()
if(!saved){
    return res.status(404).send({message: "error occurred while saving user"})
}
res.send(saved)
})

export default router 