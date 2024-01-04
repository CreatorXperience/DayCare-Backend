import mongoose from "mongoose"
import { connection_logger } from "../logger/connection-logger"
import { Application } from "express"
import Router from "../utils/routers"

const connectToMongoDBDatabase = async (app: Application, port: string, uri: string | undefined)=> {
     if(!uri){
   return   connection_logger.error("NO URI PROVIDED")
     }
    mongoose.connect(uri).then(()=>{
     connection_logger.info("connected to mongodb database")

   //   if(process.env.NODE_ENV !== "test"){
   //    app.listen(port, ()=>{
   //       connection_logger.info("Listening on port" + " "+ port)
   //     })
   //   }
    


   //  app.get('/', (req,res)=>{
   //    res.send("Welcome to this API")
   //  })


// Router(app)


     }).catch(()=>{
       connection_logger.error("error occured while connecting")
     })


   }
   export default connectToMongoDBDatabase