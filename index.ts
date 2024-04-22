import express from "express"
import dotenv from "dotenv"
import { MongoMemoryServer } from "mongodb-memory-server"
import connectToMongoDBDatabase from "./startup/mongodb-connection"
import get_test_uri from "./startup/get-uri"
import Router from "./utils/routers"
import { exceptionRejectionLogger } from "./logger/connection-logger"
import socketConnection from "./socket"
import { TConnectionArgs } from "./type"

// TODO:  run `npm run build` before start the server

require("express-async-errors")

dotenv.config()

exceptionRejectionLogger()


if(!process.env.DAYCARE_PRIVATE_KEY){
  process.exit(1)
}
const app = express()

let httpServer = socketConnection()

let PORT = process.env.PORT || "3030"

let server:MongoMemoryServer

async function get_uri_and_connect(connect_database: (connectionArgs: TConnectionArgs)=> void){
 let {server:mockServer,uri} = await get_test_uri()
  server = mockServer
  let items = {server: httpServer, app, uri, port: PORT}
  connect_database(items)
}

get_uri_and_connect(connectToMongoDBDatabase)

if(process.env.NODE_ENV === "test"){
  Router(app)
}

export {app,PORT,server}