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
exports.server = exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_connection_1 = __importDefault(require("./startup/mongodb-connection"));
// import get_test_uri from "./startup/get-uri"
const mongodb_memory_server_1 = require("mongodb-memory-server");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
let PORT = process.env.PORT || "3030";
exports.PORT = PORT;
let server;
function mockServer(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.server = server = yield mongodb_memory_server_1.MongoMemoryServer.create();
        let uri = process.env.NODE_ENV === "test" ? server.getUri() : process.env.URI;
        console.log(server);
        callback(app, PORT, uri);
    });
}
mockServer(mongodb_connection_1.default);
