import mongoose from "mongoose";


let otp_schema = new mongoose.Schema({
    owner: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    otp: {type: String, required: true}
})

let Otp_model = mongoose.model("otps", otp_schema)
export default Otp_model
