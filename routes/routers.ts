import { Application } from "express";
import express from "express";
import signup from "./childcare-signup"

const Router = (app: Application)=>{
app.use(express.json())
app.use("/signup", signup)
}

export default Router