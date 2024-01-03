import { Application } from "express";

import signup from "../routes/signup"
const Router = (app: Application)=>{
app.use("/signup", signup)
}

export default Router