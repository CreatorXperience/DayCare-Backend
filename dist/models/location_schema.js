"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let location_schema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});
exports.default = location_schema;
