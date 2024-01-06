import express, { Application} from "express"
import dotenv from "dotenv"
import { MongoMemoryServer } from "mongodb-memory-server"
import connectToMongoDBDatabase from "./startup/mongodb-connection"
import get_test_uri from "./startup/get-uri"
import Router from "./utils/routers"
import { connection_logger } from "./logger/connection-logger"
import winston from "winston"

require("express-async-errors")



let  expressLogger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
  ],
  rejectionHandlers: [
    new winston.transports.Console()
]
})

dotenv.config()
const app = express()

let PORT = process.env.PORT || "3030"

let server:MongoMemoryServer

async function get_uri_and_connect(connect_database: (app: Application, port: string, uri: string | undefined
  )=> void){
 let {server:mockServer,uri} = await get_test_uri()
  server = mockServer
  connect_database(app,PORT,uri)
}


get_uri_and_connect(connectToMongoDBDatabase)


if(process.env.NODE_ENV !== "test"){
  app.listen(PORT, ()=>{
     connection_logger.info("Listening on port" + " "+ PORT)
   })
 }

 app.get('/', (req,res)=>{
  res.send("Welcome to this API")
})


Router(app)


export {app,PORT,server}
