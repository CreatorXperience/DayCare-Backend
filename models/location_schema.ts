import mongoose from "mongoose"


let location_schema =  new mongoose.Schema({
type: {
type: String,
enum: ["Point"],
required: true
},
coordinates: {
type: [Number],
required: true
}
})



export default location_schema
