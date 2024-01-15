import mongoose from "mongoose"
import { connection_logger } from "../logger/connection-logger"
import { Application } from "express"
import Router from "../utils/routers"
import multer from "multer"
import handleUploadChildCareProfile from "../routes/childcare-upload"
import childcare_image_model from "../models/child-care-image"
import user_image_model from "../models/user-image"


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
  database: childcare_image_model,
  path: "/upload/childcares"
}

let userOptions = {
  storage: upload,
  bucket,
  database: user_image_model,
  path: "/upload/users"
}

handleUploadChildCareProfile(childcare_options)
handleUploadChildCareProfile(userOptions)

Router(app)

     }).catch(()=>{
       connection_logger.error("error occured while connecting")
     })


   }
   export default connectToMongoDBDatabase