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
const get_uri_1 = __importDefault(require("./startup/get-uri"));
const routers_1 = __importDefault(require("./utils/routers"));
const connection_logger_1 = require("./logger/connection-logger");
const socket_1 = __importDefault(require("./socket"));
// TODO:  run `npm run build` before start the server
require("express-async-errors");
dotenv_1.default.config();
(0, connection_logger_1.exceptionRejectionLogger)();
if (!process.env.DAYCARE_PRIVATE_KEY) {
    process.exit(1);
}
const app = (0, express_1.default)();
exports.app = app;
let httpServer = (0, socket_1.default)();
let PORT = process.env.PORT || "3030";
exports.PORT = PORT;
let server;
function get_uri_and_connect(connect_database) {
    return __awaiter(this, void 0, void 0, function* () {
        let { server: mockServer, uri } = yield (0, get_uri_1.default)();
        exports.server = server = mockServer;
        let items = { server: httpServer, app, uri, port: PORT };
        connect_database(items);
    });
}
get_uri_and_connect(mongodb_connection_1.default);
if (process.env.NODE_ENV === "test") {
    (0, routers_1.default)(app);
}
