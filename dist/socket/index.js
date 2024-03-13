"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const __1 = require("..");
const socket_io_1 = require("socket.io");
let onlineUsers = [];
const socketConnection = () => {
    let httpServer = http_1.default.createServer(__1.app);
    let io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"
        }
    });
    io.on("connection", (socket) => {
        console.log("connected to io server");
        socket.on("newUser", (user) => {
            let found = onlineUsers && onlineUsers.some((item) => item.userId === user);
            if (!found) {
                onlineUsers.push({ userId: user, socketId: socket.id });
                io.emit("onlineUsers", onlineUsers);
            }
            console.log(onlineUsers);
        });
        socket.on("newMessage", (message) => {
            console.log(message);
            let online = onlineUsers.filter((user) => user.userId === message.reciever);
            console.log(online);
            if (online[0].socketId) {
                io.to(online[0].socketId).emit("getMessage", message);
                io.to(online[0].socketId).emit("newMessageNotification", message);
            }
        });
        socket.on("disconnect", () => {
            let online = onlineUsers.filter((item) => item.socketId !== socket.id);
            onlineUsers = online;
            io.emit("onlineUsers", onlineUsers);
        });
    });
    return httpServer;
};
exports.default = socketConnection;
