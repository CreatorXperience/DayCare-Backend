import { Application } from "express";
import express from "express";
import cors from "cors"
import signup from "../routes/signup"
import auth from "../routes/auth"
import verify_email from "../routes/verify-otp"
import create_profile from "../routes/childcare-profile"
import error from "../middlewares/error";
import child_care_location from "../routes/childcares"
import seach_childcares from "../routes/search-childcares"
import favorite from "../routes/favorites"
import create_user_profile from "../routes/create-user-profile"
import article from "../routes/article"
import chat from "../routes/chat"
import message from "../routes/message"
import registerChild from  "../routes/registerChild"
import multer from "multer"
import mongoose from "mongoose";
import article_image_model from "../models/article-image-model";
import childcare_image_model from "../models/child-care-image";
import UploadImageRoutes from "../routes/handle-upload";
import user_routes  from "../routes/users"


const Router = (app: Application, bucket?: mongoose.mongo.GridFSBucket )=>{
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/signup", signup)
app.use("/auth", auth)
app.use("/verify-email", verify_email)
app.use("/create-childcare-profile",create_profile)
app.use("/locate-childcares", child_care_location)
app.use("/search-childcares", seach_childcares)
app.use("/register", registerChild)
app.use("/favorite", favorite)
app.use("/create-user-profile", create_user_profile)
app.use("/article",  article)
app.use("/chat",chat)
app.use("/users", user_routes)
app.use("/message", message)
createUploadRoute(app,bucket)
app.get('/', (req,res)=>{
  res.send("Welcome to this API")
})
app.use(error)
}


const createUploadRoute = ( app: Application,bucket?: mongoose.mongo.GridFSBucket)=>{
  if(bucket){
    let storage = multer.memoryStorage()
    let upload = multer({storage})
    let uploadOptions = [
      {
        storage: upload,
        bucket,
        collection: article_image_model,
        path: "/upload/article"
      },
      {
        storage: upload,
        bucket,
        collection: childcare_image_model,
        path: "/upload/childcares"
      }
    ]
    
    uploadOptions.forEach((options)=> app.use(UploadImageRoutes(options)))
  }
}

export default Router


