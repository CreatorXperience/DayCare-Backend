import mongoose from "mongoose"
import { connection_logger } from "../logger/connection-logger"
import Router from "../utils/routers"
import multer from "multer"
import UploadImageRoutes from "../routes/handle-upload"
import childcare_image_model from "../models/child-care-image"
import article_image_model from "../models/article-image-model"
import { TConnectionArgs } from "../type"


const connectToMongoDBDatabase = async (connectionArgs: TConnectionArgs)=> {
  let {uri, app, server, port} = connectionArgs
     if(!uri){
   return   connection_logger.error("NO URI PROVIDED")
     }

    mongoose.connect(uri).then(()=>{
     connection_logger.info("connected to mongodb database")

let storage = multer.memoryStorage()
let upload = multer({storage})

let bucket  = new mongoose.mongo.GridFSBucket(mongoose.connection.db)


let uploadOptions = [
  {
    storage: upload,
    bucket,
    collection: article_image_model,
    path: "/upload/article"
  },
  {
    storage: upload,
    bucket,
    collection: childcare_image_model,
    path: "/upload/childcares"
  }
]

uploadOptions.forEach((options)=> UploadImageRoutes(options))

Router(app)


if(process.env.NODE_ENV !== "test"){
 server.listen(port, ()=>{
  connection_logger.info("Listening on port" + " "+ port)
    })
  }

     }).catch(()=>{
       connection_logger.error("error occured while connecting")
     })


   }
   export default connectToMongoDBDatabase