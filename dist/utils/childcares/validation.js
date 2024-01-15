"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validation = (profilePayload) => {
    let payloadSchema = joi_1.default.object({
        title: joi_1.default.string().required().min(5).max(20),
        amount: joi_1.default.string().required(),
        perDuration: joi_1.default.number().required().min(1).max(24),
        rating: joi_1.default.number().required(),
        description: joi_1.default.string().required().min(10),
        owner: joi_1.default.string().required(),
        phonenumber: joi_1.default.string().required().min(10).max(10),
        isOpen: joi_1.default.string().required(),
        image: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        userId: joi_1.default.string().required()
    });
    return payloadSchema.validate(profilePayload);
};
exports.default = validation;
