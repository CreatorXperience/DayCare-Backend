"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const child_care_profile_1 = require("./child-care-profile");
dotenv_1.default.config();
const user_signup_schema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true, maxLength: 25, minLength: 5 },
    email: { type: String, required: true, minLength: 5, maxLength: 255, unique: true },
    password: { type: String, required: true, maxLength: 255 },
    is_verified: { type: Boolean, default: false },
    day_care_owner: { type: Boolean, default: false },
    favorite: { type: [child_care_profile_1.child_care_profile_schema], default: [] },
    article: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "articles" }
}, {
    methods: {
        generateAuthToken: function () {
            let token = jsonwebtoken_1.default.sign({ _id: this._id }, process.env.DAYCARE_PRIVATE_KEY);
            return token;
        }
    }
});
const user_signup_model = mongoose_1.default.model("user_accounts", user_signup_schema);
exports.default = user_signup_model;
