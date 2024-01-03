import express from "express"
import dotenv from "dotenv"
import connectToMongoDBDatabase from "./startup/mongodb-connection"
dotenv.config()
const app = express()

const PORT = process.env.PORT || "3030"



connectToMongoDBDatabase(app,PORT).then(()=>{
  console.log("connected successfully")
})

export {app,PORT}
