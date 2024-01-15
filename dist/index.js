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
require("express-async-errors");
const node_http_1 = require("node:http");
const dev_server_1 = __importDefault(require("./startup/dev-server"));
dotenv_1.default.config();
(0, connection_logger_1.exceptionRejectionLogger)();
const app = (0, express_1.default)();
exports.app = app;
const myServer = (0, node_http_1.createServer)(app);
let PORT = process.env.PORT || "3030";
exports.PORT = PORT;
let server;
function get_uri_and_connect(connect_database) {
    return __awaiter(this, void 0, void 0, function* () {
        let { server: mockServer, uri } = yield (0, get_uri_1.default)();
        exports.server = server = mockServer;
        connect_database(app, uri);
    });
}
get_uri_and_connect(mongodb_connection_1.default);
(0, dev_server_1.default)(myServer, PORT);
if (process.env.NODE_ENV === "test") {
    (0, routers_1.default)(app);
}
