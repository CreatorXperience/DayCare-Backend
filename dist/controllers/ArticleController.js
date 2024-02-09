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
exports.createArticle = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userProfileValidation_1 = __importDefault(require("../utils/childcares/userProfile/userProfileValidation"));
const article_1 = __importDefault(require("../models/article"));
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payloadArticle = Object.assign(Object.assign({}, req.body), { author: new mongoose_1.default.Types.ObjectId(req.user) });
    let { error } = (0, userProfileValidation_1.default)(payloadArticle);
    if (error) {
        return res.status(404).send({ message: "Bad Payload" });
    }
    let article = new article_1.default(payloadArticle);
    let saved = yield article.save();
    if (!saved) {
        return res.status(404).send({ message: "error occured while saving article" });
    }
    return res.send(saved);
});
exports.createArticle = createArticle;
