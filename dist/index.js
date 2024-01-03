"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_connection_1 = __importDefault(require("./startup/mongodb-connection"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || "3030";
(0, mongodb_connection_1.default)(app, PORT);
app.get('/', (req, res) => {
    res.send("Welcome to this API");
});
