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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const childcare_signup_model_1 = __importDefault(require("../models/childcare-signup-model"));
const profileMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.header("authorization");
    if (!token) {
        return res.status(401).send({ message: "Permission denied. No token provided" });
    }
    let userPayload = jsonwebtoken_1.default.decode(token);
    if (!userPayload) {
        return res.status(400).send({ message: "Permission denied. Bad token" });
    }
    let user = yield childcare_signup_model_1.default.findOne({ _id: userPayload._id });
    if (!user) {
        return res.status(400).send({ message: "Permission denied. User not found" });
    }
    req.user = user;
    next();
});
exports.default = profileMiddleware;
