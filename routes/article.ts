import express, { Request } from "express"
import Joi from "joi"
import authMiddleware from "../middlewares/profile-middleware"
import article_model from "../models/article"
import mongoose from "mongoose"
import _ from "lodash"

const router = express.Router()



type TArticle = {
    title: string,
    cover_image: string,
    content: string
}
const schemaValidation = (article: TArticle)=>{
let schema = Joi.object({
title: Joi.string().required().min(5),
cover_image: Joi.string().required(),
content: Joi.string().required().min(20),
author: Joi.any().required()
})

return schema.validate(article)
}
router.post("/create-article",authMiddleware, async (req:Request & {user?:string},res)=>{
    let payloadArticle = {...req.body, author: new mongoose.Types.ObjectId(req.user)}
    let {error} = schemaValidation(payloadArticle)
    if(error){
      return   res.status(404).send({message: "Bad Payload"})
    }

    let article =  new article_model(payloadArticle)

    let saved = await article.save()
    if(!saved){
      return res.status(404).send({message: "error occured while saving article"})
    }
    return res.send(saved)
})


router.get("/articles",authMiddleware, async (req,res)=> {
let articles = await article_model.find()
if(!articles){
  return  res.status(404).send({message: "articles not found!"})
}
res.send(articles)
})


router.get("/author/:id",authMiddleware, async (req,res)=> {
  let {id} = req.params
  let article = await article_model.findOne({_id: new mongoose.Types.ObjectId(id)}).populate("author",{email: 1, _id: 1, fullname:1})
  if(!article){
    return  res.status(404).send({message: "author not found"})
  }
  res.send(article)
})

export default router