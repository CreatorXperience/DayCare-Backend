import mongoose from "mongoose"
import location_schema from "./location_schema"


const child_care_profile_schema = new mongoose.Schema({
        title:  {type: String,required: true, maxLength: 25, minLength: 5},
        amount: {type: Number, required: true,minLenth:1 },
        from: {type: String, required: true, minLenth:1 },
        to: {type: String, required: true,minLenth:1},
        rating: {type: Number, required: true,minLenth:1 },
        isVerified: {type: Boolean, default: false},
        description: {type: String, required: true, maxLength: 1000, minLength: 20},
        phonenumber: {type: String, required: true, maxLength: 10, minLength: 10}, 
        isOpen: {type: Boolean, required: true},
        image: {type: String, required: true,minLenth:1 },
        location:  {type: location_schema, required: true},
        userId: {type: String, required: true,minLenth:1 },
        owner: { type: String, required: true, minLength: 5, maxLength: 30 },
        role: { type: String, required: true, minLength: 5, maxLength: 30 },
        exactLocation: { type: String, required: true, minLength: 5, maxLength: 30 }
})


child_care_profile_schema.index({location: "2dsphere"})

const child_care_model = mongoose.model("child-cares", child_care_profile_schema)

export { child_care_model, child_care_profile_schema}
