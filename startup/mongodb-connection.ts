import mongoose from "mongoose"
import winston from "winston"
import dotenv from "dotenv"
import { Application } from "express"
dotenv.config()

let connection_logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
    ],
    
})



let URI = process.env.URI

const connectToMongoDBDatabase = async (app: Application, PORT: string)=>{
if(!URI){
    connection_logger.error("NO URI PROVIDED")
   return  process.exit(1)
    }
    try{
        await mongoose.connect(URI)
        app.listen(PORT, ()=>{
            connection_logger.info("listening on port 3030")
        })
        connection_logger.info("connected to database sucessfully")
    }
    catch(e){
        connection_logger.error("error occured while connecting to database")
    }
}


export default connectToMongoDBDatabase