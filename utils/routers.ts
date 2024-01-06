import { Application } from "express";
import express from "express";
import signup from "../routes/childcare-signup"
import auth from "../routes/childcare-login"
import verify_otp from "../routes/verify-otp"
import error from "../middlewares/error";


const Router = (app: Application)=>{
app.use(express.json())
app.use("/signup", signup)
app.use("/auth", auth)
app.use("/verify-email", verify_otp)
app.use(error)
}

export default Router