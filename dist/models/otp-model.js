"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let otp_schema = new mongoose_1.default.Schema({
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    otp: { type: String, required: true }
}, { methods: {
        getIsExpired: function (currentTime) {
            if (currentTime.getMonth() === this.createdAt.getMonth() && currentTime.getDay() === this.createdAt.getDay()) {
                if (currentTime.getHours() - this.createdAt.getHours() > 1) {
                    return false;
                }
            }
            return this.createdAt > currentTime;
        }
    } });
let Otp_model = mongoose_1.default.model("otps", otp_schema);
exports.default = Otp_model;
