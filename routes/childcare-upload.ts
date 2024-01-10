import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import {Readable} from "stream"
import childcare_image_model from "../models/child-care-image"

const router = express.Router()



const connection  = async()=> {
    let connection = mongoose.connection
    let db = connection.db
    connection.on("open",()=>{
        db = mongoose.connection.db
    })
    return db
}

let storage = multer.memoryStorage()
let upload = multer({storage})

router.post("/",upload.single("file"), async(req,res)=>{
let {owner} = req.query

if(!owner){
    return res.status(404).send({message: "owner params is missing"})
}
   let file = req.file as Express.Multer.File

   let db =  await connection()
   if(!db){
   return res.status(500).send({message: "database not found"})
   }

 if(!file){
   return res.status(404).send({message: "file not attached"})
 }
    let bucket = new mongoose.mongo.GridFSBucket(db)

    let {fieldname, originalname,mimetype, buffer,size} = file
    let newProfileImage = new  childcare_image_model({
        filename: originalname,
        size: size,
        type: mimetype,
        length: buffer.length
    })

    let read = new Readable()
    read.push(buffer)
    read.push(null)

    let uploadStream = bucket.openUploadStream(fieldname)

    let pipeData = await new Promise((resolve,reject)=>{
        read.pipe(uploadStream).on("finish", ()=>{
            resolve("Data piped from readable")
        }).on("error", ()=>{
           reject("error occured while reading data")
        })
    })
    
    newProfileImage.imageString = uploadStream.id.toString()
    newProfileImage.owner = owner as string
   let savedImage =  await newProfileImage.save()
   if(!savedImage){
return res.status(404).send({message: "couldn't save image"})
   }
   res.send({message: "image successfully uploaded", id: uploadStream.id})
      
})

export default router