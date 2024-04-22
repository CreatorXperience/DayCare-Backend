"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.childCareProfileUpdateSchema = exports.validation = void 0;
const joi_1 = __importDefault(require("joi"));
let childCareProfileUpdateSchema = (profile) => {
    let payloadSchema = joi_1.default.object({
        title: joi_1.default.string().min(5).max(20),
        amount: joi_1.default.string(),
        from: joi_1.default.string(),
        to: joi_1.default.string(),
        rating: joi_1.default.number(),
        description: joi_1.default.string().min(10),
        phonenumber: joi_1.default.string().min(11).max(11),
        isOpen: joi_1.default.boolean(),
        image: joi_1.default.string(),
        location: joi_1.default.string(),
        userId: joi_1.default.string(),
        role: joi_1.default.string(),
    });
    return payloadSchema.validate(profile);
};
exports.childCareProfileUpdateSchema = childCareProfileUpdateSchema;
const validation = (profilePayload) => {
    let payloadSchema = joi_1.default.object({
        title: joi_1.default.string().required().min(5).max(20),
        amount: joi_1.default.string().required(),
        from: joi_1.default.string().required(),
        to: joi_1.default.string().required(),
        rating: joi_1.default.number().required(),
        description: joi_1.default.string().required().min(10),
        phonenumber: joi_1.default.string().required().min(11).max(11),
        isOpen: joi_1.default.boolean().required(),
        image: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
        role: joi_1.default.string().required().max(30),
    });
    return payloadSchema.validate(profilePayload);
};
exports.validation = validation;
