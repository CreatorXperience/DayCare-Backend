import mongoose from "mongoose"
import { connection_logger } from "../logger/connection-logger"
import Router from "../utils/routers"
import { TConnectionArgs } from "../type"




const connectToMongoDBDatabase = async (connectionArgs: TConnectionArgs)=> {
  let {uri, app, server, port} = connectionArgs
     if(!uri){
   return   connection_logger.error("NO URI PROVIDED")
     }

    mongoose.connect(uri).then(()=>{
     connection_logger.info("connected to mongodb database")


    let gridBucket  = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
   
    Router(app,gridBucket)

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