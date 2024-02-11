"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const __1 = require("..");
const socket_io_1 = require("socket.io");
const socketConnection = () => {
    let httpServer = http_1.default.createServer(__1.app);
    let io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"
        }
    });
    io.on("connection", () => {
        console.log("connected to io server");
    });
    return httpServer;
};
exports.default = socketConnection;
