"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const childcare_signup_1 = __importDefault(require("./childcare-signup"));
const Router = (app) => {
    app.use(express_1.default.json());
    app.use("/signup", childcare_signup_1.default);
};
exports.default = Router;
