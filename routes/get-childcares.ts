import express from "express"
import child_care_model from "../models/child-care-profile"
import Joi from "joi"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

const validation = (payload: {long: number,lat: number})=> {
let schema = Joi.object({
long: Joi.number().required(),
lat: Joi.number().required()
})

return schema.validate(payload)
}


type TPayload = {
    sortby: string,
    location: string,
   maxp: number;
   minp: number
}

 
const  filterChildCareValidation = (payload: TPayload)=>{
    let schema = Joi.object({
        sortby: Joi.string().required(),
       location: Joi.string().required(),
       maxp: Joi.number().required(),
       minp: Joi.number().required()
        })
        
        return schema.validate(payload)
}

router.get("/", async (req,res)=> {
let {error} = validation(req.body)
if(error){
return  res.status(404).send({message: error.details[0].message})
}
let child_care = await child_care_model.find({location: {$nearSphere: {$geometry: {type: "Point", coordinates: [req.body.long, req.body.lat]}}}})

if(!child_care){
    return res.status(404).send({message: "No child care is available at the specified location"})
}

res.send(child_care)
})

router.get("/filter", async(req,res)=>{
let {error} = filterChildCareValidation(req.body)
if(error){
    return res.status(404).send({message: error.details[0].message})
}
    let [city,country] = req.body.location.split(",")
    // console.log(city,country)
let get_location =  await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
    headers: {
        "X-Api-Key": process.env.API_KEY
    }
})

if(!get_location.data){
    return res.status(500).send({message: "error occured, couldn't get location"})
}
res.send(get_location.data)
})



export  default router;
