import mongoose from "mongoose";

const child_care_account_schema = new mongoose.Schema({
fullname: {type: String, required: true, maxLength: 25, minLength: 5},
email: {type: String, required: true, minLength: 5, maxLength: 255},
password: {type: String, required: true, minLength: 255, maxLength: 255}
})

const child_care_login_model = mongoose.model("child-care-accounts", child_care_account_schema)
export default child_care_login_model