"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection_logger = void 0;
const winston_1 = __importDefault(require("winston"));
let connection_logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
exports.connection_logger = connection_logger;
