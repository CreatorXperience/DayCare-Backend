"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchemaValidation = exports.schemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const schemaValidation = (payload) => {
    let schema = joi_1.default.object({
        name: joi_1.default.string().required().min(5).max(25),
        children_name: joi_1.default.string().required().min(5).max(25),
        gender: joi_1.default.string().required().min(1),
        age: joi_1.default.number().required(),
        drop: joi_1.default.string().required().min(1),
        take: joi_1.default.string().required().min(1),
        role: joi_1.default.string().required().min(1),
        user: joi_1.default.string().required().min(1)
    });
    return schema.validate(payload);
};
exports.schemaValidation = schemaValidation;
const profileSchemaValidation = (payload) => {
    let schema = joi_1.default.object({
        name: joi_1.default.string().min(5).max(25),
        children_name: joi_1.default.string().min(5).max(25),
        gender: joi_1.default.string(),
        age: joi_1.default.number(),
        drop: joi_1.default.string(),
        take: joi_1.default.string(),
        role: joi_1.default.string(),
        user: joi_1.default.string()
    });
    return schema.validate(payload);
};
exports.profileSchemaValidation = profileSchemaValidation;
