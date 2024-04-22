import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { child_care_profile_schema } from "./child-care-profile";

dotenv.config()

const user_signup_schema = new mongoose.Schema({
fullname: {type: String, required: true, maxLength: 25, minLength: 5},
email: {type: String, required: true, minLength: 5, maxLength: 255, unique: true},
password: {type: String, required: true,  maxLength: 255},
is_verified:  {type:  Boolean, default: false}, 
day_care_owner: {type: Boolean, default: false},
favorite: {type: [child_care_profile_schema],default: [] },
article: {type:   mongoose.Schema.Types.ObjectId, ref: "articles"}
}, {
methods:  {
generateAuthToken: function(){
let token = jwt.sign({_id: this._id}, process.env.DAYCARE_PRIVATE_KEY as string) 
return token
}
}
})

const user_signup_model = mongoose.model("user_accounts", user_signup_schema)
export default user_signup_model
