import express from "express"
import Joi from "joi"
import authMiddleware from "../middlewares/profile-middleware"
import article_model from "../models/article"

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
router.post("/create-article",authMiddleware, async (req,res)=>{
    let {error} = schemaValidation(req.body)
    if(error){
      return   res.status(404).send({message: "Bad Payload"})
    }

    let article =  new article_model({
      ...req.body
    })

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

export default router