import {Request, Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import user_signup_model  from "../models/user-account-model"
import _ from "lodash"

const authMiddleware = async  (req: Request & {user?: any}, res: Response, next: NextFunction)=> {
let token =  req.header("authorization")	
if(!token){
return res.status(401).send({message: "Permission denied. No token provided"})
}

let userPayload =  jwt.decode(token) as jwt.JwtPayload
if(!userPayload){
return  res.status(400).send({message: "Permission denied. Bad token"})
}

let user = await user_signup_model.findOne({_id: userPayload._id})
if(!user){
return  res.status(400).send({message: "Permission denied. User not found"})
}

req.user = user._id.toString()
next()
}

export default authMiddleware
