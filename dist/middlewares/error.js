"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const error = (err) => {
    const errorLogger = winston_1.default.createLogger({
        level: "error",
        transports: [
            new winston_1.default.transports.Console(),
        ],
    });
    errorLogger.error(err);
};
exports.default = error;
