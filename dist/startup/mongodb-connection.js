"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let connection_logger = winston_1.default.createLogger({
    level: "info",
    transports: [
        new winston_1.default.transports.Console(),
    ],
});
let URI = process.env.URI;
const connectToMongoDBDatabase = (app, PORT) => __awaiter(void 0, void 0, void 0, function* () {
    if (!URI) {
        connection_logger.error("NO URI PROVIDED");
        return process.exit(1);
    }
    try {
        yield mongoose_1.default.connect(URI);
        app.listen(PORT, () => {
            connection_logger.info("listening on port 3030");
        });
        connection_logger.info("connected to database sucessfully");
    }
    catch (e) {
        connection_logger.error("error occured while connecting to database");
    }
});
exports.default = connectToMongoDBDatabase;
