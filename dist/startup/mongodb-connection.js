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
const connection_logger_1 = require("../logger/connection-logger");
const routers_1 = __importDefault(require("../utils/routers"));
const multer_1 = __importDefault(require("multer"));
const childcare_upload_1 = __importDefault(require("../routes/childcare-upload"));
const connectToMongoDBDatabase = (app, uri) => __awaiter(void 0, void 0, void 0, function* () {
    if (!uri) {
        return connection_logger_1.connection_logger.error("NO URI PROVIDED");
    }
    mongoose_1.default.connect(uri).then(() => {
        connection_logger_1.connection_logger.info("connected to mongodb database");
        let storage = multer_1.default.memoryStorage();
        let upload = (0, multer_1.default)({ storage });
        let bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db);
        (0, childcare_upload_1.default)(upload, bucket);
        (0, routers_1.default)(app);
    }).catch(() => {
        connection_logger_1.connection_logger.error("error occured while connecting");
    });
});
exports.default = connectToMongoDBDatabase;
