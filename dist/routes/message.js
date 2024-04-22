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
const express_1 = __importDefault(require("express"));
const message_model_1 = __importDefault(require("../models/message-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const schemaValidation_1 = __importDefault(require("../utils/message/schemaValidation"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const router = express_1.default.Router();
router.get("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { chatId } = req.query;
    let isValid = mongoose_1.default.isValidObjectId(chatId);
    if (!isValid) {
        return res.status(404).send({ message: "Invalid Chat Id" });
    }
    let messages = yield message_model_1.default.find({ chatId: chatId });
    if (!messages) {
        return res.status(404).send({ message: "message not found" });
    }
    res.send(messages);
}));
router.post("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, schemaValidation_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let { message, senderId, chatId } = req.body;
    let newMessage = new message_model_1.default({
        chatId: new mongoose_1.default.Types.ObjectId(chatId),
        senderId,
        message
    });
    let saved = yield newMessage.save();
    if (!saved) {
        return res.status(500).send({ message: "couldn't send message" });
    }
    res.send(saved);
}));
exports.default = router;
