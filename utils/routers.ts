import { Application } from "express";
import express from "express";
import signup from "../routes/signup"
import auth from "../routes/auth"
import verify_email from "../routes/verify-otp"
import create_profile from "../routes/childcare-profile"
import error from "../middlewares/error";
import profiles from "../routes/profiles"

const Router = (app: Application)=>{
app.use(express.json())
app.use("/signup", signup)
app.use("/auth", auth)
app.use("/verify-email", verify_email)
app.use("/create-profile",create_profile)
app.use("/profiles", profiles)
app.use(error)
}

export default Router
