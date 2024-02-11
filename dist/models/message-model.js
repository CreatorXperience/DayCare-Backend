"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    message: { type: String, required: true },
    senderId: { type: String, required: true },
    chatId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "chats" }
});
const MessageModel = mongoose_1.default.model("messages", messageSchema);
exports.default = MessageModel;
