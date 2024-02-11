import express, { Request, Response } from "express"
import mongoose from "mongoose"
import multer from "multer"
import {Readable} from "stream"
import { app } from ".."
import authMiddleware from "../middlewares/profile-middleware"


type TUploadOptions = {
    storage: multer.Multer,
    bucket:mongoose.mongo.GridFSBucket,
    collection:  any,
    path: string
}

let UploadImageRoutes = (options: TUploadOptions)=> {
    let {collection,storage,bucket,path} = options

    app.post(path,[authMiddleware, storage.single("file")], async(req: Request & {user?: string},res:Response)=>{
        let user = req.user
        
        if(!user){
            return res.status(404).send({message: "owner params is missing"})
        }
           let file = req.file as Express.Multer.File
        
        
         if(!file){
           return res.status(404).send({message: "file not attached"})
         }
      
        
            let {fieldname, originalname,mimetype, buffer,size} = file
            let newProfileImage = new collection({ 
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
            newProfileImage.owner = user 
           let savedImage =  await newProfileImage.save()
           if(!savedImage){
        return res.status(404).send({message: "couldn't save image"})
           }
           res.send({message: "image successfully uploaded", id: uploadStream.id})
              
        })


        app.get("/upload/:id", (req,res)=>{
            let {id} = req.params
        
           let downloadStream =  bucket.openDownloadStream(new mongoose.Types.ObjectId(id))
        
           downloadStream.on("file", (file)=>{
            res.set("Content-Type", file.type)
           })
        
           downloadStream.pipe(res)
            
        })
}




export default UploadImageRoutes