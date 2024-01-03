import mongoose from "mongoose"


const child_care_profile_schema = new mongoose.Schema({
    title:  {type: String,required: true, maxLength: 25, minLength: 5},
    amount: {type: Number, required: true},
    perDuration: {type: String, required: true},
    rating: {type: Number, required: true},
    time: {type: Date, required: true}, 
    isVerified: {type: Boolean, default: false},
    description: {type: String, required: true, maxLength: 1000, minLength: 20},
    owner: {type: String, required: true, minLength: 5, maxLength: 15},
    phone_number: {type: String, required: true, maxLength: 10, minLength: 10}, 
    isOpen: {type: Boolean, required: true},
    image: {type: String, required: true}
})


const child_care_model = mongoose.model("child-cares", child_care_profile_schema)

export default child_care_model