"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
let otpValidation = (otpPayload) => {
    let otpSchema = joi_1.default.object({
        otp: joi_1.default.string().required().min(4).max(4)
    });
    return otpSchema.validate(otpPayload);
};
router.post("/", (req, res) => {
    let { error } = otpValidation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
});
