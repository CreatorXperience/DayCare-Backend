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
const connectToMongoDBDatabase = (app, port, uri) => __awaiter(void 0, void 0, void 0, function* () {
    if (!uri) {
        return connection_logger_1.connection_logger.error("NO URI PROVIDED");
    }
    mongoose_1.default.connect(uri).then(() => {
        connection_logger_1.connection_logger.info("connected to mongodb database");
        //   if(process.env.NODE_ENV !== "test"){
        //    app.listen(port, ()=>{
        //       connection_logger.info("Listening on port" + " "+ port)
        //     })
        //   }
        //  app.get('/', (req,res)=>{
        //    res.send("Welcome to this API")
        //  })
        // Router(app)
    }).catch(() => {
        connection_logger_1.connection_logger.error("error occured while connecting");
    });
});
exports.default = connectToMongoDBDatabase;
