"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("../routes/signup"));
const auth_1 = __importDefault(require("../routes/auth"));
const verify_otp_1 = __importDefault(require("../routes/verify-otp"));
const create_childcare_profile_1 = __importDefault(require("../routes/create-childcare-profile"));
const error_1 = __importDefault(require("../middlewares/error"));
const get_childcares_1 = __importDefault(require("../routes/get-childcares"));
const Router = (app) => {
    app.use(express_1.default.json());
    app.use("/signup", signup_1.default);
    app.use("/auth", auth_1.default);
    app.use("/verify-email", verify_otp_1.default);
    app.use("/create-profile", create_childcare_profile_1.default);
    app.use("/locate-childcares", get_childcares_1.default);
    app.use(error_1.default);
};
exports.default = Router;
