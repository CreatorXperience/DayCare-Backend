import mongoose from "mongoose";

const article_schema = new mongoose.Schema({
    title: {type: String,required: true,minLength: 5},
    createdAt:{type: Date, default: Date.now},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "user_accounts"},
    cover_image: {type: String, required: true},
    content: {type: String, required: true, minLength: 20}
})


const article_model  =  mongoose.model("articles", article_schema)

export default article_model