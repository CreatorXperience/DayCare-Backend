"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let childcare_image_schema = new mongoose_1.default.Schema({
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    type: { type: String, required: true },
    size: { type: String, required: true },
    length: { type: Number, required: true },
    owner: { type: String, required: true },
    imageString: { type: String, required: true }
});
let childcare_image_model = mongoose_1.default.model("childcare-images", childcare_image_schema);
exports.default = childcare_image_model;
