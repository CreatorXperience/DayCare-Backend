import express, { Request } from "express"
import {child_care_model} from "../models/child-care-profile"
import authMiddleware from "../middlewares/profile-middleware"
import validation from "../utils/childcares/validation"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

router.post("/", authMiddleware,  async (req:Request & {user?: string},res)=>{
let requestPayload = {...req.body, userId: req.user }


let {error} = validation(requestPayload)

if(error){ 
return res.status(404).send({message: error.details[0].message})
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

requestPayload.location = {type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude]}

	 let newProfile = new child_care_model(requestPayload)
	 let saved =  await newProfile.save()
	 if(!saved){
return res.status(404).send({message: "couldn't save profile to database", status: "successfull"})
	 }
	   return res.send(saved)
})



export default router;
