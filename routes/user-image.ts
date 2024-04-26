import express from "express"
import user_image_model from "../models/user-image"
import authMiddleware from "../middlewares/profile-middleware"
const router = express.Router()


router.get("/:id",authMiddleware, async(req,res)=>{
    let {id} = req.params
    const getImage = await user_image_model.findOne({owner: id})
    if(!getImage){
        return res.status(404).send({message: "image not found"})
    }

    return res.send({imageId: getImage.imageString})
})

export default router