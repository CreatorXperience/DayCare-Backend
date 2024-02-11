"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schemaValidation = (article) => {
    let schema = joi_1.default.object({
        title: joi_1.default.string().required().min(5),
        cover_image: joi_1.default.string().required(),
        content: joi_1.default.string().required().min(20),
        author: joi_1.default.any().required()
    });
    return schema.validate(article);
};
exports.default = schemaValidation;
