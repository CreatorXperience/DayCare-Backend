import { Application } from "express";
import express from "express";
import cors from "cors"
import signup from "../routes/signup"
import auth from "../routes/auth"
import verify_email from "../routes/verify-otp"
import create_profile from "../routes/childcare-profile"
import error from "../middlewares/error";
import child_care_location from "../routes/get-childcares"
import seach_childcares from "../routes/search-childcares"
import favorite from "../routes/favorites"
import create_user_profile from "../routes/create-user-profile"
import article from "../routes/article"
import chat from "../routes/chat"
import message from "../routes/message"
import registerChild from  "../routes/registerChild"


const Router = (app: Application)=>{
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
app.use("/message", message)


app.get('/', (req,res)=>{
  res.send("Welcome to this API")
})

app.use(error)
}

export default Router
