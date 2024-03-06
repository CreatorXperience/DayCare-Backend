import express, { Request } from "express"
import {child_care_model} from "../models/child-care-profile"
import axios from "axios"
import dotenv from "dotenv"
import { filterChildCareValidation} from "../utils/childcares/get-childcare-validation"
import authMiddleware from "../middlewares/profile-middleware"
import mongoose from "mongoose"
import { childCareProfileUpdateSchema } from "../utils/childcares/validation"

dotenv.config()

const router = express.Router()



router.get("/:long/:lat", authMiddleware, async (req,res)=> {
let  {long, lat}  = req.params

if(!long && !lat){
   return   res.status(404).send({message: "Invalid longitude and latitude"})
}

let child_care = await child_care_model.find({location: {$nearSphere: {$geometry: {type: "Point", coordinates: [long, lat]}}}})

if(!child_care){
    return res.status(404).send({message: "No child care is available at the specified location"})
}

res.send(child_care)
})


router.get("/user", authMiddleware, async(req,res)=>{
let {id} = req.query

if(!id){
    return res.status(404).send({message: "Id not provided"})
}
    
let daycare = await child_care_model.findOne({userId: id})
if(!daycare){
return res.status(404).send({message: "Could not find daycare with associated with these user"})
}
return res.send(daycare)

})


router.get("/:daycareId", authMiddleware, async (req,res)=>{
let  {daycareId} = req.params
if(!mongoose.isValidObjectId(daycareId)){
    return res.status(404).send({message: "Invalid Object Id"}) 
}

let daycare = await child_care_model.findOne({_id: new mongoose.Types.ObjectId(daycareId)})
if(!daycare){
    return res.status(404).send({message: "couldn't find daycare"})
}

res.send(daycare)
})




router.patch("/", authMiddleware, async (req: Request & {user?:string}, res)=>{
let userId = req.user;
let {error} =  childCareProfileUpdateSchema(req.body)
if(error){
    return res.status(404).send({message: error.details[0].message})
}

if(req.body.location){
    let [city, country] = req.body.location.split(",")

    let get_location =  await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
        headers: {
            "X-Api-Key": process.env.API_KEY
        }
    })

    let location_data = get_location.data

    if(!location_data){
    return res.status(500).send({message: "error occured, couldn't get location"})
    }

    let location  = {type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude]}

    let childcare  = await child_care_model.updateOne({userId: userId}, {$set: {...req.body, location: location }})
    if(!childcare){
   return res.status(404).send({message: "Couldn't update profile"})
    }
    return res.send(childcare)
}

let childcare  = await child_care_model.updateOne({userId: userId}, {$set: req.body})
if(!childcare){
   return res.status(404).send({message: "Couldn't update profile"})
}
res.send(childcare)



})



router.post("/filter", authMiddleware, async(req,res)=>{
let {error} = filterChildCareValidation(req.body)
if(error){
    return res.status(404).send({message: error.details[0].message})
}
    let [city,country] = req.body.location.split(",")

let get_location =  await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
    headers: {
        "X-Api-Key": process.env.API_KEY
    }
})

let location_data = get_location.data


if(!location_data){
    return res.status(500).send({message: "error occured, couldn't get location"})
}

let child_care = await child_care_model.find({location: {$nearSphere: {$geometry: {type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude]}}}, amount: {$lt: req.body.maxp, $gt: req.body.minp}})


if(!child_care){
    return res.status(404).send({message:"Couldn't get childcares at the specified location"})
}
res.send(child_care)
})




export  default router;
