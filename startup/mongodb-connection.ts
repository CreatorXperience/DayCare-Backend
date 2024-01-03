import mongoose from "mongoose"
import get_test_uri from "./get-uri"
import { connection_logger } from "../logger/connection-logger"
import { Application } from "express"

const connectToMongoDBDatabase = async (app: Application, port: string)=> {
   const  {uri} =  await get_test_uri()
   console.log(uri)
     if(!uri){
   return   connection_logger.error("NO URI PROVIDED")
     }
    mongoose.connect(uri).then(()=>{
     connection_logger.info("connected to mongodb database")
     
     app.listen(port, ()=>{
      connection_logger.info("Listening on port" + " "+ port)
    })

    app.get('/', (req,res)=>{
      res.send("Welcome to this API")
    })

     }).catch(()=>{
       connection_logger.error("error occured while connecting")
     })
   }
   export default connectToMongoDBDatabase