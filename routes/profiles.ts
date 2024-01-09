import express from "express"
import childcare_profile_model from "../models/child-care-profile"
const router = express.Router()


router.get("profiles", async (req,res)=>{

let profiles = await childcare_profile_model.find()
if(!profiles){
return res.status(404).send({message: "profiles not found"})
}
res.send(profiles)
})



export default router
