"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterChildCareValidation = exports.locateUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const locateUserValidation = (payload) => {
    let schema = joi_1.default.object({
        long: joi_1.default.number().required(),
        lat: joi_1.default.number().required()
    });
    return schema.validate(payload);
};
exports.locateUserValidation = locateUserValidation;
const filterChildCareValidation = (payload) => {
    let schema = joi_1.default.object({
        location: joi_1.default.string().required(),
        maxp: joi_1.default.number().required(),
        minp: joi_1.default.number().required()
    });
    return schema.validate(payload);
};
exports.filterChildCareValidation = filterChildCareValidation;
