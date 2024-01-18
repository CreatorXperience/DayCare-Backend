"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const article_schema = new mongoose_1.default.Schema({
    title: { type: String, required: true, minLength: 5 },
    createdAt: { type: Date, default: Date.now },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "user_accounts" },
    cover_image: { type: String, required: true },
    content: { type: String, required: true, minLength: 20 }
});
const article_model = mongoose_1.default.model("articles", article_schema);
exports.default = article_model;
