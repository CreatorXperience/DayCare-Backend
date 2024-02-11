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
const chats_model_1 = __importDefault(require("../models/chats-model"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const router = express_1.default.Router();
router.post("/:secondId", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.user;
    let { secondId } = req.params;
    let chat = yield chats_model_1.default.findOne({ members: { $all: [userId, secondId] } });
    if (chat) {
        return res.send({ message: "chat already exist", chat });
    }
    let newChat = new chats_model_1.default({ members: [userId, secondId] });
    let saved = yield newChat.save();
    if (!saved) {
        return res.status(500).send({ message: "Couldn't save chat" });
    }
    return res.send({ message: "created new chat", saved });
}));
router.get("/allchats", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.user;
    let chat = yield chats_model_1.default.find({ members: { $in: [userId] } });
    if (!chat) {
        return res.status(404).send({ message: "user doesn't belong to any chat" });
    }
    res.send({ chat });
}));
router.get("/single-chat/:secondId", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.user;
    let { secondId } = req.params;
    let chat = yield chats_model_1.default.findOne({ members: { $all: [userId, secondId] } });
    if (!chat) {
        return res.status(404).send({ message: "chat not found" });
    }
    res.send({ chat });
}));
exports.default = router;
