import mongoose from "mongoose"



const user_profile_schema =  new mongoose.Schema({
    name: {type: String, required: true, minLength: 5, maxLength: 25},
    children_name: {type: String, required: true, minLength: 5, maxLength: 25},
    gender: {type: String, required: true},
    age: {type:  Number, required: true},
    drop: {type: String, required: true},
    take: {type: String, required: true},
    role: {type: String, required: true},
    user:  {type: String, required: true}
})



let user_profile_model =  mongoose.model("users_profile", user_profile_schema)

export default user_profile_model