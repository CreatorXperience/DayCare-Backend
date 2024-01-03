import express, { Application } from "express"
import dotenv from "dotenv"
import connectToMongoDBDatabase from "./startup/mongodb-connection"
// import get_test_uri from "./startup/get-uri"
import { MongoMemoryServer } from "mongodb-memory-server"

dotenv.config()
const app = express()

let PORT = process.env.PORT || "3030"

let server:MongoMemoryServer

async function mockServer(callback: (app: Application, port: string, uri: string | undefined
  )=> void){
 server = await MongoMemoryServer.create()
  let uri = process.env.NODE_ENV === "test"? server.getUri(): process.env.URI
  console.log(server)
  
  callback(app,PORT,uri)
}


mockServer(connectToMongoDBDatabase)




export {app,PORT,server}
