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
const get_childcares_1 = __importDefault(require("../routes/get-childcares"));
const search_childcares_1 = __importDefault(require("../routes/search-childcares"));
const favorites_1 = __importDefault(require("../routes/favorites"));
const create_user_profile_1 = __importDefault(require("../routes/create-user-profile"));
const article_1 = __importDefault(require("../routes/article"));
const chat_1 = __importDefault(require("../routes/chat"));
const message_1 = __importDefault(require("../routes/message"));
const Router = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/signup", signup_1.default);
    app.use("/auth", auth_1.default);
    app.use("/verify-email", verify_otp_1.default);
    app.use("/create-childcare-profile", childcare_profile_1.default);
    app.use("/locate-childcares", get_childcares_1.default);
    app.use("/search-childcares", search_childcares_1.default);
    app.use("/favorite", favorites_1.default);
    app.use("/create-user-profile", create_user_profile_1.default);
    app.use("/article", article_1.default);
    app.use("/chat", chat_1.default);
    app.use("/message", message_1.default);
    app.get('/', (req, res) => {
        res.send("Welcome to this API");
    });
    app.use(error_1.default);
};
exports.default = Router;
