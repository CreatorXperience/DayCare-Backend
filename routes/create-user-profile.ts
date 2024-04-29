import express from "express"
import authMiddleware from "../middlewares/profile-middleware";
import user_profile_model from "../models/userprofile";
import  {schemaValidation, profileSchemaValidation } from "../utils/userProfile/userProfileValidation";

const router = express.Router()

router.post("/",authMiddleware, async (req,res)=> {
let {error}=  schemaValidation(req.body)
if(error){
    return  res.status(404).send({message: error.details[0].message})
}

const userProfile = new user_profile_model(req.body)
let saved = await userProfile.save()
if(!saved){
    return res.status(404).send({message: "error occurred while saving user"})
}
res.send(saved)
})

router.get("/:id",authMiddleware, async(req,res)=>{
    let {id} = req.params
    let getProfile = await user_profile_model.findOne({user: id})
    if(!getProfile){
        return res.status(404).send({message: "Profile not found"})
    }
    return res.send(getProfile)
})

router.patch("/:id",authMiddleware, async(req,res)=>{
    let {id} = req.params
    let {error} = profileSchemaValidation(req.body)
    if(error){
        return res.status(404).send({message: error.details[0].message})
    }
    let update = await user_profile_model.updateOne({user: id}, {$set: {...req.body}})
    if(!update){
        return res.status(500).send({message: "Couldn't update profile}"})
    }
    return res.send(update)
})

export default router 