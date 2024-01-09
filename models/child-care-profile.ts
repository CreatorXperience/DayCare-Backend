import mongoose from "mongoose"
import location_schema from "./location_schema"

type TMongooseSchema = {
    title: string;
    amount: number;
    perDuration: string;
    rating: number;
    isVerified: boolean;
    description: string;
    owner: string;
    phonenumber: string;
    isOpen: boolean;
    image: string;
    location: {
        x: string;
        y: string;
    };
    userId: any;
}
const child_care_profile_schema = new mongoose.Schema<TMongooseSchema>({
    title:  {type: String,required: true, maxLength: 25, minLength: 5},
    amount: {type: Number, required: true},
    perDuration: {type: String, required: true},
    rating: {type: Number, required: true},
    isVerified: {type: Boolean, default: false},
    description: {type: String, required: true, maxLength: 1000, minLength: 20},
    owner: {type: String, required: true, minLength: 5, maxLength: 15},
    phonenumber: {type: String, required: true, maxLength: 10, minLength: 10}, 
    isOpen: {type: Boolean, required: true},
    image: {type: String, required: true},
    location:  {type: location_schema, required: true},
    userId: {type: String, required: true}
})


const child_care_model = mongoose.model("child-cares", child_care_profile_schema)

export default child_care_model
