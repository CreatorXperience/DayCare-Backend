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
const joi_1 = __importDefault(require("joi"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const article_1 = __importDefault(require("../models/article"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const schemaValidation = (article) => {
    let schema = joi_1.default.object({
        title: joi_1.default.string().required().min(5),
        cover_image: joi_1.default.string().required(),
        content: joi_1.default.string().required().min(20),
        author: joi_1.default.any().required()
    });
    return schema.validate(article);
};
router.post("/create-article", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payloadArticle = Object.assign(Object.assign({}, req.body), { author: new mongoose_1.default.Types.ObjectId(req.user) });
    let { error } = schemaValidation(payloadArticle);
    if (error) {
        return res.status(404).send({ message: "Bad Payload" });
    }
    let article = new article_1.default(payloadArticle);
    let saved = yield article.save();
    if (!saved) {
        return res.status(404).send({ message: "error occured while saving article" });
    }
    return res.send(saved);
}));
router.get("/articles", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let articles = yield article_1.default.find();
    if (!articles) {
        return res.status(404).send({ message: "articles not found!" });
    }
    res.send(articles);
}));
router.get("/author/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let article = yield article_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) }).populate("author", { email: 1, _id: 1, fullname: 1 });
    if (!article) {
        return res.status(404).send({ message: "author not found" });
    }
    res.send(article);
}));
exports.default = router;
