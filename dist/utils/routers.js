"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("../routes/signup"));
const auth_1 = __importDefault(require("../routes/auth"));
const verify_otp_1 = __importDefault(require("../routes/verify-otp"));
const childcare_profile_1 = __importDefault(require("../routes/childcare-profile"));
const error_1 = __importDefault(require("../middlewares/error"));
const profiles_1 = __importDefault(require("../routes/profiles"));
const Router = (app) => {
    app.use(express_1.default.json());
    app.use("/signup", signup_1.default);
    app.use("/auth", auth_1.default);
    app.use("/verify-email", verify_otp_1.default);
    app.use("/create-profile", childcare_profile_1.default);
    app.use("/profiles", profiles_1.default);
    app.use(error_1.default);
};
exports.default = Router;
