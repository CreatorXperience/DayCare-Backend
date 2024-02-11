"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
let otpValidation = (otpPayload) => {
    let otpSchema = joi_1.default.object({
        otp: joi_1.default.string().required().min(6).max(6),
        ownerId: joi_1.default.string().required()
    });
    return otpSchema.validate(otpPayload);
};
exports.default = otpValidation;
