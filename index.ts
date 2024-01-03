import express from "express"

import connectToMongoDBDatabase from "./startup/mongodb-connection"
const app = express()

const PORT = process.env.PORT || "3030"

connectToMongoDBDatabase(app, PORT)

app.get('/', (req,res)=>{
    res.send("Welcome to this API")
})
