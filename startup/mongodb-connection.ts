import mongoose from "mongoose"
import { connection_logger } from "../logger/connection-logger"
import { Application } from "express"
import Router from "../utils/routers"
import multer from "multer"
import handleUploadImage from "../routes/handle-upload"
import childcare_image_model from "../models/child-care-image"
import article_image_model from "../models/article-image-model"

const connectToMongoDBDatabase = async (app: Application, uri: string | undefined)=> {
     if(!uri){
   return   connection_logger.error("NO URI PROVIDED")
     }

    mongoose.connect(uri).then(()=>{
     connection_logger.info("connected to mongodb database")

let storage = multer.memoryStorage()
let upload = multer({storage})

let bucket  = new mongoose.mongo.GridFSBucket(mongoose.connection.db)

let childcare_options = {
  storage: upload,
  bucket,
  collection: childcare_image_model,
  path: "/upload/childcares"
}

let article_options = {
  storage: upload,
  bucket,
  collection: article_image_model,
  path: "/upload/article"
}


handleUploadImage(childcare_options)
handleUploadImage(article_options)


Router(app)

     }).catch(()=>{
       connection_logger.error("error occured while connecting")
     })


   }
   export default connectToMongoDBDatabase