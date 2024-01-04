"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const child_care_profile_schema = new mongoose_1.default.Schema({
    title: { type: String, required: true, maxLength: 25, minLength: 5 },
    amount: { type: Number, required: true },
    perDuration: { type: String, required: true },
    rating: { type: Number, required: true },
    time: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    description: { type: String, required: true, maxLength: 1000, minLength: 20 },
    owner: { type: String, required: true, minLength: 5, maxLength: 15 },
    phone_number: { type: String, required: true, maxLength: 10, minLength: 10 },
    isOpen: { type: Boolean, required: true },
    image: { type: String, required: true }
});
const child_care_model = mongoose_1.default.model("child-cares", child_care_profile_schema);
exports.default = child_care_model;
