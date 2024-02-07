"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_profile_schema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 25 },
    children_name: { type: String, required: true, minLength: 5, maxLength: 25 },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    drop: { type: String, required: true },
    take: { type: String, required: true },
    role: { type: String, required: true }
});
let user_profile_model = mongoose_1.default.model("users_profile", user_profile_schema);
exports.default = user_profile_model;
