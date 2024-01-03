import express, { Application} from "express"
import dotenv from "dotenv"
import connectToMongoDBDatabase from "./startup/mongodb-connection"
import { MongoMemoryServer } from "mongodb-memory-server"
import get_test_uri from "./startup/get-uri"
import Router from "./routes/routers"

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


Router(app)


export {app,PORT,server}
