import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const child_care_signup_schema = new mongoose.Schema({
fullname: {type: String, required: true, maxLength: 25, minLength: 5},
email: {type: String, required: true, minLength: 5, maxLength: 255, unique: true},
password: {type: String, required: true,  maxLength: 255},
is_verfied:  {type:  Boolean, default: true}
}, {
methods:  {
generateAuthToken: function(){
let token = jwt.sign({_id: this._id}, process.env.DAYCARE_PRIVATE_KEY as string) 
return token
}
}
}
						    )

const child_care_signup_model = mongoose.model("child-care-accounts", child_care_signup_schema)
export default child_care_signup_model
