"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionRejectionLogger = exports.connection_logger = void 0;
const winston_1 = __importDefault(require("winston"));
let connection_logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
exports.connection_logger = connection_logger;
let exceptionRejectionLogger = () => {
    let expressLogger = winston_1.default.createLogger({
        level: "info",
        transports: [
            new winston_1.default.transports.Console()
        ],
        exceptionHandlers: [
            new winston_1.default.transports.Console(),
        ],
        rejectionHandlers: [
            new winston_1.default.transports.Console()
        ]
    });
};
exports.exceptionRejectionLogger = exceptionRejectionLogger;
