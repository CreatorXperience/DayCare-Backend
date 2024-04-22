import mongoose from "mongoose";

const registeredDaycaresSchema = new mongoose.Schema({
    registered: [String]
})


const RegisteredDaycareModel =  mongoose.model("registered", registeredDaycaresSchema)
export default RegisteredDaycareModel