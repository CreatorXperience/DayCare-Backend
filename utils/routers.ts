import { Application } from "express";
import express from "express";
import signup from "../routes/signup"
import auth from "../routes/auth"
import verify_email from "../routes/verify-otp"
import create_profile from "../routes/create-childcare-profile"
import error from "../middlewares/error";
import child_care_location from "../routes/get-childcares"
import child_care_upload from "../routes/childcare-upload"

const Router = (app: Application)=>{
app.use(express.json())
app.use("/signup", signup)
app.use("/auth", auth)
app.use("/verify-email", verify_email)
app.use("/create-profile",create_profile)
app.use("/locate-childcares", child_care_location)
app.use("/childcare-upload", child_care_upload)
app.use(error)
}

export default Router
