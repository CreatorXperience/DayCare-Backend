import mongoose from "mongoose"

let user_image_schema = new mongoose.Schema({
    filename: {type: String, required: true},
    createdAt: {type: Date, default: Date.now },
    type: {type: String, required: true},
    size: {type: String, required: true},
    length: {type: Number, required: true},
    owner: {type: String, required: true},
    imageString: {type: String, required: true}
})

let user_image_model = mongoose.model("users-image", user_image_schema)

export default user_image_model