import  { Request, Response } from "express"
import mongoose from "mongoose"
import multer from "multer"
import {Readable} from "stream"
import authMiddleware from "../middlewares/profile-middleware"
import express from "express"
import { child_care_model } from "../models/child-care-profile"
const router =  express.Router()

type TUploadOptions = {
    storage: multer.Multer,
    bucket:mongoose.mongo.GridFSBucket,
    collection:  any,
    path: string
}

let UploadImageRoutes = (options: TUploadOptions)=> {
    let {collection,storage,bucket,path} = options

   router.post(path,[authMiddleware, storage.single("file")], async(req: Request & {user?: string},res:Response)=>{
        let user = req.user

           let file = req.file as Express.Multer.File
    
         if(!file){
           return res.status(404).send({message: "file not attached"})
         }  
         
         let imageId: string  = ""
         
        try{
            let exsitingImage = await collection.findOne({owner: user})
            if(exsitingImage){
              imageId = exsitingImage.imageString
               bucket.delete(new mongoose.Types.ObjectId(imageId))
               await collection.deleteOne({owner: user})
            }
        }catch(e){
            console.log(e)
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
           
           if(imageId){
            await collection.updateOne({image: imageId}, {$set: {image: uploadStream.id.toString()} })
           }
           else{
            await collection.updateOne({userId: user}, {$set: {image: uploadStream.id.toString()} })
           }

           if(!savedImage){
        return res.status(404).send({message: "couldn't save image"})
           }
           res.send({message: "image successfully uploaded", id: uploadStream.id})
              
        })


       router.get(`${path}/:id`, (req,res)=>{
        console.log("reach line 84")

            let {id} = req.params

            if(!id || id === "undefined" || id === undefined ||  !mongoose.isValidObjectId(id)){
               return res.status(404).send({message: "Invalid"})
            }

            console.log("reach line 92")
           let item =  bucket.find({_id: new mongoose.Types.ObjectId(id)})
           console.log("reach line 94")

           if(!item){
            return res.status(404).send({message: "image with the given id not found"})
           }
           console.log("reach line 99")

           let downloadStream =  bucket.openDownloadStream(new mongoose.Types.ObjectId(id))
           
           downloadStream.on("file", (file)=>{
            res.set("Content-Type", file.type)
           })
        
           downloadStream.pipe(res)
            
        })


        return  router
}




export default UploadImageRoutes