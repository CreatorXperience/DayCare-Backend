import express, { Request } from "express"
import {child_care_model} from "../models/child-care-profile"
import authMiddleware from "../middlewares/profile-middleware"
import {validation} from "../utils/childcares/validation"
import axios from "axios"
import dotenv from "dotenv"
import user_signup_model from "../models/user-account-model"
import mongoose from "mongoose"
dotenv.config()

const router = express.Router()

router.post("/", authMiddleware,  async (req:Request & {user?: string},res)=>{
let requestPayload = {...req.body, userId: req.user }


let {error} = validation(requestPayload)

if(error){ 
return res.status(404).send({message: error.details[0].message})
}


let getProfile = await child_care_model.findOne({userId: requestPayload.userId})
if(getProfile){
	return res.send(getProfile)
}

let existingUser = await user_signup_model.findById(requestPayload.user_id)
if(existingUser){
	requestPayload.owner = existingUser?.fullname
}
let [city, country] = requestPayload.location.split(",")

let get_location =  await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
    headers: {
        "X-Api-Key": process.env.API_KEY
    }
})

let location_data = get_location.data

if(!location_data){
    return res.status(500).send({message: "error occured, couldn't get location"})
}
requestPayload.exactLocation = requestPayload.location
requestPayload.location = {type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude]}

	 let newProfile = new child_care_model(requestPayload)
	 let saved =  await newProfile.save()
	 let user = await user_signup_model.updateOne({_id: new mongoose.Types.ObjectId(req.user)}, {$set: {day_care_owner: true}})
	 if(!saved && !user){
return res.status(404).send({message: "couldn't save profile to database", status: "successfull"})
	 }
	 
	   return res.send(saved)
})



export default router;
