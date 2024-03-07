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
const mongoose_1 = __importDefault(require("mongoose"));
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, chatId } = req.query;
    if (!id || id === "undefined" || !mongoose_1.default.isValidObjectId(id)) {
        return res.status(404).send({ messsage: "Invalid or no query id" });
    }
    let user = yield user_account_model_1.default.findOne({ _id: id }, { password: 0 });
    if (!user) {
        return res.status(404).send({ message: "user not found" });
    }
    res.send(Object.assign(Object.assign({}, user), { chatId: chatId }));
}));
exports.default = router;
