"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const validateUserPayload = (userPayload) => {
    let passwordOption = {
        min: 10,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1
    };
    const validation = joi_1.default.object({
        email: joi_1.default.string().required().min(5).max(255).email(),
        password: (0, joi_password_complexity_1.default)(passwordOption).required().min(5).max(30)
    });
    return validation.validate(userPayload);
};
exports.default = validateUserPayload;
