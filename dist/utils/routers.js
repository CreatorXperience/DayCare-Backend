"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const signup_1 = __importDefault(require("../routes/signup"));
const auth_1 = __importDefault(require("../routes/auth"));
const verify_otp_1 = __importDefault(require("../routes/verify-otp"));
const childcare_profile_1 = __importDefault(require("../routes/childcare-profile"));
const error_1 = __importDefault(require("../middlewares/error"));
const childcares_1 = __importDefault(require("../routes/childcares"));
const search_childcares_1 = __importDefault(require("../routes/search-childcares"));
const favorites_1 = __importDefault(require("../routes/favorites"));
const create_user_profile_1 = __importDefault(require("../routes/create-user-profile"));
const article_1 = __importDefault(require("../routes/article"));
const chat_1 = __importDefault(require("../routes/chat"));
const message_1 = __importDefault(require("../routes/message"));
const registerChild_1 = __importDefault(require("../routes/registerChild"));
const multer_1 = __importDefault(require("multer"));
const article_image_model_1 = __importDefault(require("../models/article-image-model"));
const child_care_image_1 = __importDefault(require("../models/child-care-image"));
const handle_upload_1 = __importDefault(require("../routes/handle-upload"));
const users_1 = __importDefault(require("../routes/users"));
const Router = (app, bucket) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/signup", signup_1.default);
    app.use("/auth", auth_1.default);
    app.use("/verify-email", verify_otp_1.default);
    app.use("/create-childcare-profile", childcare_profile_1.default);
    app.use("/locate-childcares", childcares_1.default);
    app.use("/search-childcares", search_childcares_1.default);
    app.use("/register", registerChild_1.default);
    app.use("/favorite", favorites_1.default);
    app.use("/create-user-profile", create_user_profile_1.default);
    app.use("/article", article_1.default);
    app.use("/chat", chat_1.default);
    app.use("/users", users_1.default);
    app.use("/message", message_1.default);
    createUploadRoute(app, bucket);
    app.get('/', (req, res) => {
        res.send("Welcome to this API");
    });
    app.use(error_1.default);
};
const createUploadRoute = (app, bucket) => {
    if (bucket) {
        let storage = multer_1.default.memoryStorage();
        let upload = (0, multer_1.default)({ storage });
        let uploadOptions = [
            {
                storage: upload,
                bucket,
                collection: article_image_model_1.default,
                path: "/upload/article"
            },
            {
                storage: upload,
                bucket,
                collection: child_care_image_1.default,
                path: "/upload/childcares"
            }
        ];
        uploadOptions.forEach((options) => app.use((0, handle_upload_1.default)(options)));
    }
};
exports.default = Router;
